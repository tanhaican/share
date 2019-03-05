title: JS异步编程
speaker: 谭海灿
url: https://github.com/tanhaican/
plugins:
    - echarts

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

# JS异步编程 {.text-landing.text-shadow}

在javascript单线程的世界里，没有异步寸步难行 ...  {.text-intro.animated}

By 谭海灿 {.text-intro}

[:fa-github: Github](https://github.com/tanhaican){.button.ghost}


<slide :class="size-40 aligncenter">

### 为什么要使用异步编程

在（javascript）单线程的世界里，如果有多个任务，就必须排队，前面一个完成，再继续后面的任务。就像一个ATM排队取钱似的，前面一个不取完，就不让后面的取。
为了这个问题，javascript提供了2种方式： 同步和异步。
异步就像银行取钱填了单子约了号，等着叫到号，再去做取钱，等待的时间里还可以干点其他的事儿~

<slide :class="size-40 aligncenter">

### 异步回调带来的问题

<slide :class="size-40 aligncenter">

### 1. 回调地狱 （Callbacks Hell）
举个例子：通过api拿到数据，数据里面有图片，图片加载成功渲染，那么代码如下：
```javascript
// 伪代码
request(url, (data) => {
    if(data){
        loadImg(data.src, () => {
            render();
        })
    }
})
```

如果有在业务逻辑比较复杂或者NodeJS I/O操作比较频繁的时候，就成了下面这个样子：
```javascript
doSth1((...args, callback) => {
    doSth2((...args, callback) => {
        doSth3((...args, callback) => {
            doSth4((...args, callback) => {
                doSth5((...args, callback) => {

                })
            })
        })
    })
})
```
这样的维护性和可读性，整个人瞬间感觉不好了~


<slide :class="size-40 aligncenter">

### 2. 异常处理
```javascript
try {
    setTimeout(() => {
        throw new Error('unexpected error');
    }, 100);
} catch (e) {
    console.log('error2', e.message);
}
```
以上代码运行抛出异常，但try catch不能得到未来时间段的异常。

<slide :class="size-40 aligncenter">

### 3. 流程控制不方便

流程控制只能通过维护各种状态来处理，不利于管理
```javascript
request_api(callback(status) {
    switch (status) {
        case s1: ...
        case s2: ...
        case s3: ...
        default: ...
    }
});
```


<slide :class="size-40 aligncenter">

### 异步编程现有解决方案对比
#### 1.事件机制
不管浏览器还是NodeJS，提供了大量内置事件API来处理异步。

事件监听
浏览器中如： websocket, ajax, canvas, img，FileReader等
NodeJS如： stream, http等

自定义事件(本质上是一种发布订阅模式)
NodeJS中的EventEmitter事件模型
浏览器中：如DOM可使用addEventListener，此外浏览器也提供一些自定义事件的API，但兼容性不好，具体可以这篇文章；也可以用Node中的EventEmitter;jquery中也对此做了封装，on,bind等方法支持自定义事件。
事件小结
事件一定程度上解决了解耦和提升了代码可维护性；对于异常处理，只有部分支持类似error事件才能处理。若想实现异常处理机制，只有自己模拟error事件，比较繁琐。

Promise
Promise严格来说不是一种新技术，它只是一种机制，一种代码结构和流程，用于管理异步回调。为了统一规范产生一个Promise/A+规范，点击查看Promise/A+中文版，cnode的William17实现了Promise/A+规范，有兴趣的可以点这里查看

promise状态由内部控制，外部不可变
状态只能从pending到resovled, rejected，一旦进行完成不可逆
每次then/catch操作返回一个promise实例，可以进行链式操作



部分代码如下：

readFile(path1).then(function (data) {
    console.log(data.toString());
    return readFile(path2);
}).then(function (data) {
    console.log(data.toString());
    return readFile(errorPath);
}).then(function (data) {
    console.log(data.toString());
}).catch(function (e) {
    console.log('error', e);
    return readFile(path1);
}).then(function (data) {
    console.log(data.toString());
});
Promise的缺陷：

内部抛出错误只能通过promise.catch才能才能接收到
语义不明确
Generator
generator介绍
Generator是ES6提供的方法，是生成器，最大的特点：可以暂停执行和恢复执行（可以交出函数的执行权），返回的是指针对象.

需要自执行函数才能持续运行，否则需要手工调用流程
自执行函数借助promise, 获取异常和最终结果
generator 和 promise自执行实现
const run = function (generator) {
  var g = generator()
  var perform = function (result) {
    if (result.done === true) {
      return result.value
    }
    if (isPromise(result.value)) {
      return result.value.then(function (v) {
        return perform(g.next(v))
      }).catch(function (e) {
        return perform(g.throw(e))
      })
    } else {
      return perform(g.next(result.value))
    }

  }
  return perform(g.next())
}

const isPromise = f => f.constructor === Promise

function* g() {
  var a = yield sleep(1000, _ => 1)
  var b = yield sleep(1000, _ => 2)
  return a + b
}
function sleep(d, fn) {
  return new Promise((resolve, reject) => {
    setTimeout(_ => resolve(fn()), d)
  })
}
由于以上问题，于是一个叫 co库诞生，支持thunk和Promise.
关于thunk可以查看阮一峰老师的thunk介绍和应用

Async/Await
ES7提供了async函数，使得异步操作变得更加方便。

内置执行器
更好的语义
更多的实用场景，co参数Generator函数中yield只能是promise和thunk
实例代码：

async function asyncReadFile() {   
    var p1 = readFile(path.join(__dirname, '../data/file1.txt'));
    var p2 = readFile(path.join(__dirname, '../data/file2.txt'));
    var [f1, f2] = await Promise.all([p1, p2]);
    return `${f1.toString()}\n${f2.toString()}`;
}
(async function () {
    try {
        console.log(await asyncReadFile());
    } catch (e) {
        console.log(e.message)
    }
})();
Node8 async/await 支持
Node8.0发布，全面支持 async/await， 推荐使用 async/await， 低版本node可以使用 babel来编译处理。 而 为了方便 接口设计时 返回 promise 更方面使用者. 当然依然使用 callback , 通过 promisify做转换， Node8.0已经内置 util.promisify方法。