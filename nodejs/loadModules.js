/* eslint-disable */
const fs = require('fs');

export default (dir, except) => {
  const files = fs.readdirSync(dir);
  const requireList = [];
  files.map((file) => {
    const path = `${dir}/${file}`;
    const regResult = file.split('.');
    if (regResult && regResult[0]) {
      const fileName = regResult[0];
      // 如果有 __init__ 文件，则放在第一个加载
      if (file.match(/^__init__(\..*)?$/)) {
        requireList.unshift({ fileName, path });
      } else {
        // 如果没有需要排除的文件名
        if (except) {
          // 如果参数是一个
          if (typeof except === 'string') {
            if (fileName === except) {
              return;
            }
          // 如果参数是数组
          } else if (except instanceof Array) {
            for (const i in except) {
              if (except[i] === fileName) {
                return;
              }
            }
          }
        }
        // 导入模块
        requireList.push({ fileName, path });
      }
    }
  });
  console.log('requireList', requireList);
  // 使用文件名字作为导出的模块名
  const result = requireList.map((item) => {
    // 排除 __init__ 模块的导出
    if (item.fileName !== '__init__') {
      return { [item.fileName]: require(item.path) };
    }
    return null;
  });
  console.log(result);
  return result;
};
