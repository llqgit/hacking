/**
 * base-d to base-62(default)
 * @param  {[type]} t                                          [number string]
 * @param  {String} [l='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'] [description]
 * @return {[type]}                                            [description]
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
    let result = '';
    const a = array.concat(); // 复制数字数组
    // 下一位存在
    while (a.length > 1) {
      a[0] = parseInt(a[0], 10);
      a[1] = parseInt(a[1], 10);
      // 第一位大于 0（即，最高位大于 0）
      if (a[0] >= 1) {
        a[1] += a[0] * 10; // 最高位的值匀到第二首位
        a.shift(); // 清除第一空位
        // 对字符串长度取整，整数部分为此位的值，余数部分进行下一次计算
        const last = Math.floor(a[0] / x); // a[0]（现在的第一位），为最开始的 a[1]（开始的第二位）
        const left = a[0] % x;
        a[0] = left;
        if (result || last !== 0) {
          result += last;
        }
      } else {
        // 第一位为0，去掉
        if (result) {
          result += 0;
        }
        a.shift();
      }
    }
    return { array: result.split(''), left: a[0] };
  };
  let numberArray = t.split('');
  const result = [];
  while (numberArray.length > 1) {
    const tempResult = cal(numberArray);
    numberArray = tempResult.array;
    if (tempResult.left) {
      result.unshift(tempResult.left);
    }
  }
  result.unshift(parseInt(numberArray[0], 10));

  return result.map(i => l[i]).toString().replace(/,/g, '');
};

// 待开发
const decode = (str, chars = default_characters[62] ) => {
  return '';
};

// 默认为 62 位（全数字，全字母大小写）
module.exports = (base = 62) => {
  let characters = '';
  if (typeof base === 'number') {
    characters = default_characters[base];
  } else {
    characters = base;
  }
  const baseEncode = (num) => {
    return encode(num, characters);
  };
  const baseDecode = (str) => {
    return decode(str, characters);
  };
  return { character, encode: baseEncode, decode: baseDecode };
};
