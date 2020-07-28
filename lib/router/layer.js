function Layer(path, resolver) {
  this.path = path
  this.resolver = resolver
}
Layer.prototype.match = function (reqPath) {
  return this.path === reqPath;
}
Layer.prototype.handle_request = function (req, res, next) {
  return this.resolver(req, res, next);
}

module.exports = Layer;