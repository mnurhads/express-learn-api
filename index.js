const express = require('express')
const dotenv = require('dotenv');
const folder   = require('path')
var view = __dirname + "/views/";
var public = __dirname + "/public/";
// setup global
dotenv.config();
const app     = express()
const port    = process.env.PORT
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
const clientRouter  = require('./routes/client');

// import cogs
const setting      = require('./setting/cogs');

app.use(cors())

//  testing
var data = "okok";
var crypto = require('crypto');
const { path } = require('express/lib/application');
mdDecypt = crypto.createHash('md5').update(data).digest("hex");
// end
app.get('/', (req, res) => {
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');

    res.status(200).json({
        'responseCode': 200,
        'responseMsg': 'Connection API Successfully',
        'testing': {
            'crip': mdDecypt,
            'test': setting.makeid(65),
            'data': setting.encrypt(data),
            'createdAt': {
                'dateNow': formatted
            } 
        }
    })
})

// test view
app.get('/info', (req, res) => {
    res.sendFile(folder.join(view, 'index.html'));
})

app.use('/', express.static(public));

app.use('/api/v1/product', productRouter);
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/client', clientRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})