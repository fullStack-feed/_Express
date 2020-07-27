const http = require('http')
const Router = require('./router')
/**
 * 为每个express实例创建全新的路由系统
 */
function Application() {
  this._router = new Router();
}
// 代理router原型方法
Application.prototype.get = function (path, resolver) {
  this._router.get(path, resolver);
}
Application.prototype.listen = function (port) {
  let server = http.createServer((req, res) => {
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`)
    }
    this._router.handle(req, res, done);
  })
  server.listen(port)
}
module.exports = Application
