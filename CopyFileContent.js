const fs = require('fs');

let content = '';

function copyFileContent(src) {
    const paths = fs.readdirSync(src);

    paths.forEach((item) => {
        let _newSrc = src + '/' + item;
        const stat = fs.statSync(_newSrc);
        if (stat) {
            if (stat.isDirectory()) {
                // 是文件夹——>递归
                copyFileContent(_newSrc);
            } else if (stat.isFile()) {
                const names = item.split('.');
                if (names[1] === 'ts' && !names[2]) {
                    // copy 该格式文件的内容到一个文件
                    content += fs.readFileSync(_newSrc, 'utf-8');
                }
            }
        }
    });
}

copyFileContent('E:\\Space2\\Cat\\assets');
fs.writeFileSync('./a.txt', content);
