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

app.use(cors())

// import router
const productRouter = require('./routes/product');

app.get('/', (req, res) => {
    res.status(200).json({
      'responseCode': 200,
      'responseMsg': 'Connection API Successfully',
      // 'data': 
    })
})

app.use('/api/v1/product', productRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})