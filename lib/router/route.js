const methods = require('methods');
const Layer = require('./layer');
function Route() {
  // 保存 当前路由的所有resolver
  this.stack = [];
  // 保存 订阅时当前路由所有的方法类型
  this.methods = {}
}
methods.forEach(method => {
  Route.prototype[method] = function (resolvers) {
    resolvers.forEach(resolver => {
      let layer = new Layer('/', resolver);
      // 方便 dispatch时 能够进行match判断
      layer.method = method;
      this.methods[method] = true;
      this.stack.push(layer);
    })
  }
})
Route.prototype.handle_method = function (method) {
  return this.methods[method];
}
Route.prototype.dispatch = function (req, res, out) {
  let idx = 0;
  let next = () => {
    if (idx >= this.stack.length) out();
    let layer = this.stack[idx++];
    if (layer.method === req.method.toLowerCase()) {
      layer.handle_request(req, res, next);
    } else {
      next();
    }
  }
  next()
}
module.exports = Route;