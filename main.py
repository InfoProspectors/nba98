# -*- coding: utf-8 -*-
import requests
import json
import os


def _readfile(path):
    files = os.listdir(path)
    for filename in files:
        _openjson(filename[0:filename.rfind('.json')], path + filename)


def _openjson(dirName, filepath):
    jsonpath = './json/' + dirName
    if not os.path.exists(jsonpath):
        print('不存在' + jsonpath + '文件夹将创建')
        os.makedirs(jsonpath)
    with open(filepath, 'r', encoding='utf-8') as load_f:
        load_dict = json.load(load_f)
        for i in load_dict:
            for k in load_dict[i]:
                _requests(dirName, load_dict[i][k]['name'])


def _requests(dirName, name):
    print('开始爬取' + name + '小姐姐数据')
    request = requests.get(url='http://nba98.top/yd/ydajax/GetInfoListByKey?type=1&pageNo=1&pageSize=2000',
                           params={'k': name})
    json_text = str(request.text)
    if os.path.exists(os.path.join('./json/' + dirName + '/' + name + '.json')) == False:
        print(os.path.join(name + '.json') + '文件不存在,自动创建')
        print('待写入小姐姐数据' + name, json_text)
        file = open(os.path.join('./json/' + dirName + '/' + name + '.json'), 'w', encoding="utf-8")
        file.write(json_text)
        file.close()
        print(os.path.join(name + '.json') + '文件创建并写入成功')


if __name__ == '__main__':
    path = './json/location/'
    if os.path.exists(path):
        print('检测到省市区json文件,将开始抓取数据')
        _readfile(path)
    else:
        print('未检测到省市区json文件,将开始获取省市区信息')
        os.system("python ./city.py")
        _readfile(path)
