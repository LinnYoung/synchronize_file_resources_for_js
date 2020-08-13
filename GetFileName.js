/**
 * @file
 * @author LinnYoung (946692837@qq.com)
 * @date 2020年5月12日
 * @description synchronize XXX  to XXX.
 */

const fs = require("fs");

/**
 * 同步美术资源 到 另一个目录（只限目录之间的同步，暂不兼容文件，（文件可参考删除文件））
 * @param {* 资源路径 string} src
 * @param {* 目标路径 string} dst
 */
function fetchFiles(src, dst) {
  // 读取目录中的所有文件、目录
  const paths = fs.readdirSync(src);
  // 读取目标目录中的文件及目录
  const dPaths = fs.readdirSync(dst);
  // 获得目录中所有文件的数量
  //   const srcLen = paths.length;
  //   const dLen = dPaths.length;
  //   console.log('资源路径的文件数量：', srcLen, '目标目录的文件数量：', dLen);

  // 目标目录的文件与资源路径的文件作 对比
  let pathNames = [];
  paths.forEach((item) => {
    pathNames.push(item.split(".")[0]);
  }); // 去掉文件格式（后缀名）
  let redundantFiles = [];
  dPaths.forEach((_target, _index) => {
    // 文件名(不包括后缀)
    let _fname = _target.split(".")[0];
    if (!pathNames.includes(_fname) && _fname != "AutoAtlas") {
      // 完整路径加入待删除数组里面
      redundantFiles.push(dst + "/" + _target);
    }
  });

  // 删除目录中的文件或者文件
  console.log("待删除文件：", redundantFiles);
  redundantFiles.forEach((path) => {
    deldir(path);
  });

  paths.forEach((path) => {
    let _src = src + "/" + path;
    let _dst = dst + "/" + path;
    let stat = fs.statSync(_src);
    if (stat && stat.isFile()) {
      readable = fs.createReadStream(_src);
      writeable = fs.createWriteStream(_dst);
      readable.pipe(writeable);
    } else if (stat && stat.isDirectory()) {
      exists(_src, _dst, fetchFiles);
    }
  });
}

/**
 * 判断 目标目录 是否存在在该 目录， 不存在就创建，存在就复制
 * @param {*资源路径} src
 * @param {*目标路径} dst
 * @param {*回调函数} callback
 */
function exists(src, dst, callback) {
  let exists = fs.existsSync(dst);
  if (exists) {
    callback(src, dst);
  } else {
    fs.mkdir(dst, function () {
      callback(src, dst);
    });
  }
}

/**
 *
 * @param {* 删除文件及目录的路径}} src
 */
function deldir(src) {
  const stat = fs.statSync(src);

  if (stat && stat.isFile()) {
    fs.unlinkSync(src);
  } else {
    const list = fs.readdirSync(src);
    if (list.length > 0) {
      for (let i in list) {
        const name = src + "/" + list[i];
        deldir(name);
      }
    } else {
      fs.rmdirSync(src);
    }
  }
}

// 美术目录路径
const srca = "/opt/work/ef/arts/NEW_UI/res/Item/";
// 游戏目录路径
const srcb = "/opt/work/ef/client/assets/resources/res/Item/";

fetchFiles(srca, srcb);

// **** 小游戏
// fetchFiles("E:\\QQFiles\\946692837\\FileRecv\\abc1\\abc\\Textures",)
