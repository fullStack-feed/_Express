// let express = require('./express');
let express = require('./lib/express')

let app = express();

app.get('/user', (req, res) => {
  console.log('成功执行')
})
app.listen(9091);