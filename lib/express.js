/**
 * 应用级 入口文件
 */
const Application = require('./application');

function createApplication() {
  return new Application();
}
module.exports = createApplication;