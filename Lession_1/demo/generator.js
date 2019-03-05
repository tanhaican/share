const fs = require('fs');

const readData = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, {
            encoding: 'utf8'
        }, function (err, data) {
            if (err) throw Error('fail');
            resolve(data);
        })
    });
}

const genFun = function* () { // generator 函数特殊写法
    try {
        // yield 在暂停时刻并没有赋值，dataA 的值是在重新执行时刻由 next 方法的参数传入的
        let dataA = yield readData('a.txt'); // 状态1
        console.log('a.txt data is %d', dataA);
        let dataB = yield readData('b.txt'); // 状态2
        console.log('b.txt data is %d', dataB);
        let dataC = yield readData('c.txt'); // 状态3
        console.log('c.txt data is %d', dataC);

        console.log('sum is %d', parseInt(dataA) + parseInt(dataB) + parseInt(dataC));
    } catch (err) {
        console.log(err);
    }
};

// 驱动 Generator 执行
function run(generator) {
    let it = generator();

    function go(result) {
        // 判断是否遍历完成，标志位 result.done 为 true 表示遍历完成
        if (result.done) 
            return result.value;

        // result.value 即为返回的 promise 对象
        return result.value.then(function (value) {
            return go(it.next(value));
        }, function (error) {
            return go(it.throw(error));
        });
    }

    go(it.next()); // 【关键方法 - next】移向下一个状态
}

run(genFun);