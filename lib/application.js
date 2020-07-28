const http = require('http')
const Router = require('./router')
const methods = require('methods');
/**
 * 为每个express实例创建全新的路由系统
 */
function Application() {
  // 路由懒加载，只有使用路由系统后才会初始化路由系统

  // this._router = new Router();
}
/**
 * 对router.get 进行一个个代理，使得能够通过app.get | app.xxx 进行路由处理
 * @param {*} path 
 * @param  {...any} handlers 
 */
Application.prototype.lazy_route = function () {
  if (!this._router) {
    this._router = new Router();
  }
}
methods.forEach(method => {
  Application.prototype[method] = function (path, ...resolver) {
    this.lazy_route();
    this._router[method](path, resolver);
  }
})
Application.prototype.listen = function (port) {
  let server = http.createServer((req, res) => {
    this.lazy_route();
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`)
    }
    this._router.handle(req, res, done);
  })
  server.listen(port)
}
module.exports = Application
