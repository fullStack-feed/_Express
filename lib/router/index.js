const url = require('url')
const methods = require('methods');
const Layer = require('./layer');
const Route = require('./route')
function Router() {
  this.stack = [];
}
/**
 * 根据当前路由初始化 路由系统
 * 
 * - 为当前路由创建 Layer 和 对应的route
 * 
 * - 建立 layer 和 route 的链接
 * 
 * - 将当前layer 存到 this.stack 中 
 * 
 * @param {*} path 路由
 * @returns 当前layer对应的route实例
 */
Router.prototype.initLayer = function (path) {
  let route = new Route();
  let layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
}
/**
 * 1. path 默认处理
 * 2. 创建一个layer
 * 3. push到 this.stack中
 * @param {*} path 
 * @param {*} handler 
 */
Router.prototype.use = function (path, handler) {
  if (typeof handler !== 'function') {
    handler = path;
    path = '/';
  }
  let layer = new Layer(path, handler);
  // 标识当前layer 是一个中间件函数
  layer.route = undefined;
  this.stack.push(layer);
}
// 循环注册所有方法的处理函数
methods.forEach(method => {
  /**
   * - 初始化 路由对应的Layer
   * 
   * - 将 resolvers 存入到 route中
   * @param {*} path 
   * @param {*} resolvers 
   */
  Router.prototype[method] = function (path, resolvers) {
    let route = this.initLayer(path)
    route[method](resolvers);
  }
})
/**
 * 
 * @param {*} req 原生http模块的req
 * @param {*} res 原生http模块的res
 * @param {*} done 匹配不到路由的全局处理函数
 */
Router.prototype.handle = function (req, res, done) {
  let { pathname: reqPath } = url.parse(req.url);
  let reqMethods = req.method.toLowerCase();

  // 从 Router 的 stack 中 取出 每一个 layer 将其 对应的 route.dispatch执行
  let idx = 0;
  let next = (err) => {
    // 如果达到上限，直接执行全局处理函数（最外层传递的）
    if (idx === this.stack.length) return done;
    // 1. 取出layer
    // 2. 匹配layer中的路由，以及确认route中是存在该方法的处理函数。全部match上后执行route中的dispatch方法
    // 3. 将next函数传递给内层的rotue，以便能从route中跳出来执行下一个layer
    // 4. 如果没有匹配到，移动到下一个layer
    let layer = this.stack[idx++];
    if (err) {
      // 并且当前这个layer 是中间件函数
      if (!layer.route) {
        layer.handle_error(err, req, res, next);
      } else {
        next(err);
      }
    } else {
      // 首先 match 上路径才能执行当前layer
      if (layer.match(pathname)) {
        if (!layer.route) {
          // 处理中间件函数
          if (!layer.handle.length !== 4) {
            layer.handle_request(req, res, next);
          } else {
            next(err)
          }
        } else {
          // 处理普通路由
          if (layer.route.handle_method(req.method.toLowerCase())) {
            layer.handle_request(req, res, next);
          } else {
            next();
          }
        }
      } else {
        next();
      }
    }
  }
  next();
}
module.exports = Router;