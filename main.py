# -*- coding: utf-8 -*-
import requests
import json
import os
import tablib
import threading

def _readfile(path):
    files = os.listdir(path)
    for filename in files:
        _openjson(filename[0:filename.rfind('.json')], path + filename)


def _openjson(dirName, filepath):
    area=[]
    city= []
    province= []
    jsonpath = './json/' + dirName
    if not os.path.exists(jsonpath):
        print('不存在' + jsonpath + '文件夹将创建')
        os.makedirs(jsonpath)
    wordpath = './xls/' + dirName
    if not os.path.exists(wordpath):
        print('不存在' + wordpath + '文件夹将创建')
        os.makedirs(wordpath)
    with open(filepath, 'r', encoding='utf-8') as load_f:

        load_dict = json.load(load_f)
        if 'province' in filepath:
            # 省级json数据需要单独处理
            for i in load_dict:
                province.append(load_dict[i]['name'])
        elif 'city' in filepath:
            for i in load_dict:
                for k in load_dict[i]:
                    city.append(load_dict[i][k]['name'])
        else:
            for i in load_dict:
                for k in load_dict[i]:
                    area.append(load_dict[i][k]['name'])
    threads = [threading.Thread(target=_requests, args=('province',name, )) for name in province]
    for t in threads:
        t.start()  # 启动一个线程
    for t in threads:
        t.join()  # 等待每个线程执行结束
    threads2 = [threading.Thread(target=_requests, args=('city', name,)) for name in city]
    for c in threads2:
        c.start()  # 启动一个线程
    for c in threads2:
        c.join()  # 等待每个线程执行结束
    threads3 = [threading.Thread(target=_requests, args=('area', name,)) for name in area]
    for j in threads3:
        j.start()  # 启动一个线程
    for j in threads3:
        j.join()  # 等待每个线程执行结束

def _requests(dirName, name):
    print('开始爬取' + name + '小姐姐数据')
    url = 'http://nba98.top/yd/ydajax/GetInfoListByKey'
    params = {
        'type': 1,
        'pageNo': 1,
        'pageSize': 2000,
        'k': name
    }
    request = requests.get(url, params, timeout=16)
    json_text = str(request.text)
    if os.path.exists(os.path.join('./json/' + dirName + '/' + name + '.json')) == False:
        print(os.path.join(name + '.json') + '文件不存在,自动创建')
        # print('待写入小姐姐数据' + name, json_text)
        file = open(os.path.join('./json/' + dirName + '/' + name + '.json'), 'w', encoding="utf-8")
        file.write(json_text)
        file.close()
        print(os.path.join(name + '.json') + '文件创建并写入成功')
        print('开始写入' + name + '.xls')
        _savexsl(dirName, name)
    else:
        print(os.path.join(name + '.json') + '文件存在,将跳过写入json')
        _savexsl(dirName, name)


def _savexsl(dirName, name):
    with open(os.path.join('./json/' + dirName + '/' + name + '.json'), 'r', encoding='utf-8') as f:
        rows = json.load(f)
        xsldata = rows['data']
        lenlist = len(xsldata)
        if lenlist != 0:
            header = tuple([i for i in xsldata[0].keys()])
            data = []
            for row in xsldata:
                body = []
                for v in row.values():
                    body.append(v)
                data.append(tuple(body))
            data = tablib.Dataset(*data, headers=header)
            if os.path.exists(os.path.join('./xls/' + dirName + '/' + name + '.xls')) == False:
                print(os.path.join(name + '.xls') + '文件不存在,自动创建')
                open(os.path.join('./xls/' + dirName + '/' + name + '.xls'), 'wb').write(data.xls)
                print(name + '.xls文件写入完成')
            else:
                print(os.path.join(name + '.xsl') + '文件存在,将跳过写入xsl')
        else:
            print(os.path.join('./json/' + dirName + '/' + name + '.json') + "数据为空,不写入xsl")


if __name__ == '__main__':
    path = './json/location/'
    if os.path.exists(path):
        print('检测到省市区json文件,将开始抓取数据')
        _readfile(path)
    else:
        print('未检测到省市区json文件,将开始获取省市区信息')
        os.system("python ./city.py")
        _readfile(path)
