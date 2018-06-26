/**
 * base-d to base-62(default)
 * @param  {[type]} t                                          [number string]
 * @param  {String} [l='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'] [description]
 * @return {[type]}                                            [description]
 */

 /*
 一个数字本质上是一个一维数组，每个元素包含一个位，index代表对应的阶
 举个栗子：
 --------------
 10进制：
 12345
 [1,2,3,4,5]
 --------------
 62进制：
 12bHc
 [1,2,b,H,c] == [1,2,11,43,12]
 */

const default_characters = {
  2: '01',
  8: '01234567',
  11: '0123456789a',
  16: '0123456789abcdef',
  32: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
  36: '0123456789abcdefghijklmnopqrstuvwxyz',
  58: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  62: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  64: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/',
  66: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.!~',
};
const encode = (num, chars = default_characters[62] ) => {
  let t = num;
  let l = chars;
  if (typeof t != 'string' && t.toString) {
    t = t.toString();
  }
  const x = l.length;
  // 将最高位的值转换位 base 值
  const cal = (array) => {
    let result = [];
    let left = -1;
    const a = array.concat(); // 复制数字数组
    // 下一位存在
    while (a.length > 1) {
      let intNum = Math.floor(a[0] / x);
      let remainder = a[0] % x;
      if (intNum) { // 如果有整除部分，则余数放到 a[0] 处
        a[0] = remainder;
        result.push(intNum);
        if (a[0] == 0) {
          result.push(0);
        }
      } else { // 如果没有整除部分，则退位到下一个位
        a[1] += a[0] * 10;
        a.shift();
      }
    }
    if (a[0] > x) {
      result.push(Math.floor(a[0] / x));
      a[0] = a[0] % x;
    }
    left = a[0];
    // console.log(result, left);
    return { array: result, left };
  };
  let numberArray = t.split('').map(i => parseInt(i));
  const result = [];
  while (numberArray.length > 1) {
    const tempResult = cal(numberArray);
    numberArray = tempResult.array;
    if (tempResult.left != -1) {
      result.unshift(tempResult.left);
    }
  }
  result.unshift(parseInt(numberArray[0], 10));

  return result.map(i => l[i]).toString().replace(/,/g, '');
};

// 解码为 10进制（原理：各个位除10取余）
const decode = (str, chars = default_characters[62] ) => {
  let t = str;
  let l = chars;
  if (typeof t != 'string' && t.toString) {
    t = t.toString();
  }
  const x = l.length;
  // 将最高位的值转换位 base 值
  const cal = (array) => {
    let result = '';
    let left = -1;
    const a = array.concat(); // 复制数字数组
    // 下一位存在
    if (a.length > 1) {
      if (a[0] == 0) {
        a.shift(); // 去除第一位
        return { array: a, left };
      }
      for (let i=0; i<a.length; i++) {
        if (i + 1 == a.length) {
          left = a[i] % 10; // 如果是最后一位，则保存余数（余数即为最后一位的10进制整数）
        } else {
          a[i + 1] += (a[i] % 10) * x;  // 最高位的余数匀到第二位
        }
        a[i] = Math.floor(a[i] / 10); // 最高位保留整数部分
      }
    }
    return { array: a, left };
  };
  let numberArray = t.split('').map(i => chars.indexOf(i));
  // console.log(numberArray);
  const result = [];
  while (numberArray.length > 1) {
    const tempResult = cal(numberArray);
    numberArray = tempResult.array;
    // console.log(tempResult);
    if (tempResult.left != -1) {
      result.unshift(tempResult.left);
    }
  }
  // 最后把剩余的一位放到最前面
  result.unshift(numberArray[0]);
  return result.toString().replace(/,/g, '');
};

const bigint = (num) => {

  return {
    name: 'acb',
    num: num,
    str: '',
    toString(base = 10) {
      return decode(base);
    },
    add(n) {
      return this;
    },
    sub(n) {
      return this;
    },
    mul(n) {
      return this;
    },
    div(n) {
      return this;
    }
  };
};

// 默认为 62 位（全数字，全字母大小写）
module.exports = (base = 62) => {
  let characters = '';
  if (typeof base === 'number') {
    characters = default_characters[base];
  } else {
    characters = base;
  }
  const baseEncode = (str) => {
    return encode(str, characters);
  };
  const baseDecode = (str) => {
    return decode(str, characters);
  };
  return {
    characters,
    encode: baseEncode,
    decode: baseDecode
  };
};
