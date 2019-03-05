const fs = require('fs');

function readData(file, sum) {
    return new Promise(function(resolve, reject){
        fs.readFile(file, {encoding: 'utf8'}, function(err, newDataStr){
            if(err) reject('fail');
            let newData = parseInt(newDataStr)
            console.log(file + ' data is %d', newData);
    
            resolve(newData + sum);
        });
    });
}

readData('a.txt', 0).then(data => {
    return readData('b.txt', data)
}).then(function (data) {
    return readData('c.txt', data)
}).then(function(data){
    console.log('sum is %d', parseInt(data));
}).catch(function(err){
    throw Error('fail');
});
