const fs = require('fs');

new Promise(function(resolve, reject){
    fs.readFile('a.txt', {encoding: 'utf8'}, function(err, newData){
        if(err) reject('fail');
        console.log('a.txt data is %d', newData);

        resolve(newData);
    });
}).then(function(data){
    // 返回一个新的 promise 对象，使得下一个回调函数会等待该异步操作完成
    return new Promise(function(resolve, reject){
        fs.readFile('b.txt', {encoding: 'utf8'}, function(err, newData){
            if(err) reject('fail');
            console.log('b.txt data is %d', newData);

            resolve(parseInt(data)+parseInt(newData));
        });
    });
}).then(function(data){
    return new Promise(function(resolve, reject){
        fs.readFile('c.txt', {encoding: 'utf8'}, function(err, newData){
            if(err) reject('fail');
            console.log('c.txt data is %d', newData);

            resolve(parseInt(data)+parseInt(newData));
        });
    });
}).then(function(data){
    console.log('sum is %d', parseInt(data));
}).catch(function(err){
    throw Error('fail');
});