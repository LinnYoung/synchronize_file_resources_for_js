const fs = require('fs').promises;
const { error } = require('console');
const path = require('path');

/**
 * 异步计算文件夹总大小（字节）
 * @param {string} folderPath 文件夹路径
 * @returns {Promise<number>} 总大小（字节）
 */
async function getFolderSize(folderPath) {
    let totalSize = 0;

    try {
        // 获取路径信息
        const stats = await fs.stat(folderPath);

        // 如果是文件，直接返回大小
        if (stats.isFile()) {
            return stats.size;
        }

        // 如果是文件夹，遍历内部所有内容
        if (stats.isDirectory()) {
            const files = await fs.readdir(folderPath);

            // 递归计算每个子项的大小
            for (const file of files) {
                const fullPath = path.join(folderPath, file);
                totalSize += await getFolderSize(fullPath);
            }
        }

        return totalSize;
    } catch (err) {
        //可能存在权限不足
        // console.error('计算大小出错：', err.message);
        return 0;
    }
}

// // 用法示例
// const targetFolder = '/path/to/your/folder'; // 替换为目标文件夹路径

// 查询文件下的所有文件及目录大小用法用例： node CheckDiskSize.js C:/
const argv = process.argv;
const targetFolder = argv[2];

async function start() {
    if (!targetFolder) {
        return console.error('输出的查询路径错误');
    }

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
        return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    };

    const stats = await fs.stat(targetFolder);
    if (stats.isFile()) {
        console.log(targetFolder + '大小：', formatSize(stats.size));
        return;
    }

    if (stats.isDirectory()) {
        let totalSize = 0;
        const files = await fs.readdir(targetFolder);
        for (const file of files) {
            const fullPath = path.join(targetFolder, file);
            // getFolderSize(fullPath).then((size) => {
            //     // 格式化大小（转换为 KB/MB/GB）
            //     totalSize += size
            //     console.log(`${file}大小：${formatSize(size)}`);
            // })
            const size = await getFolderSize(fullPath);
            console.log(`${file}大小：${formatSize(size)}`);
            totalSize += size;
        }
        console.log(targetFolder + '总大小：', formatSize(totalSize));
    }
}

start();
