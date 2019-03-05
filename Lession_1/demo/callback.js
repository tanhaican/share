const fs = require('fs');

fs.readFile('a.txt', {encoding: 'utf8'}, function(err, dataA){
    if(err) throw Error('fail');
    console.log('a.txt data is %d', dataA);

    fs.readFile('b.txt', {encoding: 'utf8'}, function(err, dataB){
        if(err) throw Error('fail');
        console.log('b.txt data is %d', dataB);

        fs.readFile('c.txt', {encoding: 'utf8'}, function(err, dataC){
            if(err) throw Error('fail');
            console.log('c.txt data is %d', dataC);

            console.log('sum is %d', parseInt(dataA) + parseInt(dataB) + parseInt(dataC));
        })
    })
});