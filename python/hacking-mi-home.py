# 循环查询米家众筹物品卖出数量，保存到文件
# author: LLQ

import requests
import string
import json
import time

# 物品id，请填写自己想要查询的id
good_id = 773
# 查询睡眠秒数，每10秒一次，不建议太快
sleep = 10
# 要保存的文件名
file_name = 'fang-mi.js'

headers = { "Referer":"https://home.mi.com/detail?gid=" + good_id,
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "content-type":"application/x-www-form-urlencoded"
           }

data = '{ "detail":{"model":"Shopv2","action":"getDetail","parameters":{"gid":"' + good_id + '"}},"comment":{"model":"Comment","action":"getList","parameters":{"goods_id":"' + good_id + '","orderby":"1","pageindex":"0","pagesize":3} },"activity":{"model":"Activity","action":"getAct","parameters":{"gid":"' + good_id + '"}}}'

last = 0;

while 1:

    res = requests.post("https://home.mi.com/app/shop/pipe", data={"data": data}, headers=headers)
    result = json.loads(res.text)
    num = result["result"]["detail"]["data"]["good"]["saled"]
    print num, " +", (int(num) - int(last))

    localtime = time.asctime( time.localtime(time.time()))

    fo = open(file_name, "a")
    add = (int(num) - int(last))
    fo.write(str(num) + " +" + str(add) + "  " + str(localtime) + "\n")
    fo.close()

    last = num
    # 查询速度
    time.sleep(sleep)
