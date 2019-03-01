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