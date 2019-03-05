const events = require('events');
const fs = require('fs');
const eventEmitter = new events.EventEmitter();

const files = [{
        fileName: 'a.txt',
        dataName: 'dataA'
    }, {
        fileName: 'b.txt',
        dataName: 'dataB'
    }, {
        fileName: 'c.txt',
        dataName: 'dataC'
    },
];
let index = 0;

// 订阅自定义事件
eventEmitter.on('next', function (data) {
    if (index > 2) return console.log('sum is %d', parseInt(data));

    fs.readFile(files[index].fileName, {
        encoding: 'utf8'
    }, function (err, newData) {
        if (err) throw Error('fail');
        console.log(files[index].fileName + ' data is %d', newData);
        index++;
        // 驱动执行
        eventEmitter.emit('next', parseInt(data) + parseInt(newData));
    })
});

// 触发自定义事件执行
eventEmitter.emit('next', 0);