const express = require('express')
const app     = express()
const port    = 4000

// IMPORT LIBRARY
// import body parser
const bodyParser = require('body-parser');
// use app url body url-ended
app.use(bodyParser.urlencoded({ extended: false }))
// parse app
app.use(bodyParser.json())

// import cors
const cors = require('cors')
// import router
const productRouter = require('./routes/product');
const userRouter    = require('./routes/user');

// import cogs
const setting      = require('./setting/cogs');

app.use(cors())

//  testing
var data = "password";
var crypto = require('crypto');
mdDecypt = crypto.createHash('md5').update(data).digest("hex");
// end
app.get('/', (req, res) => {
    res.status(200).json({
      'responseCode': 200,
      'responseMsg': 'Connection API Successfully',
      'testing': mdDecypt,
      'data': setting.encrypt(data),
    })
})

app.use('/api/v1/product', productRouter);
app.use('/api/v1/auth', userRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})