// let express = require('express');
let express = require('./lib/express')

// --- 调通express

// let app = express();

// app.get('/user', (req, res) => {
//   console.log('成功执行')
// })
// app.listen(9091);


// --- 路由next基本用法

let app = express();

app.get('/', (req, res, next) => {
  console.log('您现在访问的是全局路由处理逻辑')
})
app.get('/user', (req, res, next) => {
  console.log('您现在访问的是/user路由,我是user-resolver1')
  // 如果不执行next函数，是无法调用resolver2的
  next();
  console.log('当/user路由所有的resolver执行完毕后，我再执行')
}, (req, res, next) => {
  console.log('您现在访问的是/user路由,我是user-resolver2')
  // 如果不执行next函数，是无法到达第二个/user 路由处理函数的
  next();
})

app.get('/user', (req, res, next) => {
  console.log('您现在访问的是/user路由,我是user-resolver3')
  // 如果不执行next函数，是无法调用resolver2的
  next();
}, (req, res, next) => {
  console.log('您现在访问的是/user路由,我是user-resolver4')
  // next();
})
app.listen(9091);