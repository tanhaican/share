const fs = require('fs');

// 封装成 await 语句期望的 promise 对象
const readFile = function () {
    let args = arguments;
    return new Promise(function (resolve, reject) {
        fs.readFile(...args, function (err, data) {
            // await 会吸收 resolve 传入的值作为返回值赋给变量
            resolve(data);
        })
    })
};

const asyncReadFile = async function () {
    let dataA = await readFile('a.txt', {
        encoding: 'utf8'
    });
    console.log('a.txt data is %d', dataA);
    let dataB = await readFile('b.txt', {
        encoding: 'utf8'
    });
    console.log('b.txt data is %d', dataB);
    let dataC = await readFile('c.txt', {
        encoding: 'utf8'
    });
    console.log('c.txt data is %d', dataC);
    console.log('sum is %d', parseInt(dataA) + parseInt(dataB) + parseInt(dataC));
};

asyncReadFile();