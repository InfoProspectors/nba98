# -*- coding: utf-8 -*-
import requests
import json
import os


def open_Json(filepath):
    with open(filepath, 'r', encoding='utf-8') as load_f:
        load_dict = json.load(load_f)
        for i in load_dict:
            for k in load_dict[i]:
                _requests(load_dict[i][k]['name'])


def _requests(name):
    print('开始爬取' + name + '小姐姐数据')
    request = requests.get(url='http://nba98.top/yd/ydajax/GetInfoListByKey?type=1&pageNo=1&pageSize=20000',
                           params={'k': name})
    json_text = str(request.text)
    print('小姐姐数据', json_text)
    if os.path.exists(os.path.join('./json/' + name + '.json')) == False:
        print(os.path.join(name + '.json') + '文件不存在,自动创建')
        file = open(os.path.join('./json/' + name + '.json'), 'w', encoding="utf-8")
        file.write(json_text)
        file.close()
        print(os.path.join(name + '.json') + '文件创建并写入成功')


if __name__ == '__main__':
    open_Json('./json/area.json')
