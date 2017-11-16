#coding=utf-8
import os
import sys
import re
from PIL import Image

def splice(images, num):
    width = images[0].size[0]
    height = images[0].size[1]
    length = len(images)
    target = Image.new('RGB', (width * num, height * length / num))
    left = 0
    top = 0
    for i in range(length):
        target.paste(images[i], (left, top))
        if i != 0 and ( i + 1 ) % num == 0:
            left = 0
            top += height
        else:
            left += width
    quality_value = 100
    target.save(path + '_big.jpg', quality = quality_value)

path = sys.argv[1]
print path
images = [] # all images
for root, dirs, files in os.walk(path):
    for file in files :
        if re.match('.*\.(jpg|jpeg|png)$', file):
            images.append(Image.open(path + '/' + file))

splice(images, 10)
