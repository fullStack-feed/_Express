const url = require('url')
function Router() {
  this.stack = [];
}
/**
 * 
 * @param {*} path 路由
 * @param {*} resolver 解析函数
 */
Router.prototype.get = function (path, resolver) {
  this.stack.push({
    path,
    method: 'get',
    resolver
  })
}
/**
 * 
 * @param {*} req 原生http模块的req
 * @param {*} res 原生http模块的res
 * @param {*} done 匹配不到路由的全局处理函数
 */
Router.prototype.handle = function (req, res, done) {
  let { pathname: reqPath } = url.parse(req.url);
  let reqMethods = req.method.toLowerCase();
  // 匹配所有注册的路由,skip 掉第一个  *默认路由
  for (let i = 0; i < this.stack.length; i++) {
    let { path, method, resolver } = this.stack[i];
    // match
    if (path === reqPath && method === reqMethods) {
      return resolver(req, res);
    }
  }
  // 没有匹配到路由，则执行默认处理方法
  done();
}
module.exports = Router;