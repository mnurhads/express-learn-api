const express = require('express');
const router  = express.Router();

//import database
const connect = require('../config/db');
const { body, validationResult } = require('express-validator');
const req = require('express/lib/request');

router.post('/login', [
    body("username").notEmpty(),
    body("password").notEmpty(),
], (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    // define formdata
    let formData = {
        name: req.body.username,
        password: req.body.password,
    }

    // hash
    var data = formData.password;
    var crypto = require('crypto');
    passHex = crypto.createHash('md5').update(data).digest("hex");
    // end

    connect.query(`SELECT * FROM users WHERE name = '${formData.name}' AND password = '${passHex}'`, formData, function(err, rows) {
        if(err) {
            return res.status(500).json({
                status: false,
                message: err,
            })
        }

        // validasi data
        if (rows.length < 1) {
            return res.status(404).json({
                'responseCode': 404,
                'responseMsg': "User Tidak ditemukan"
            })
        } else {
            return res.status(200).json({
                'responseCode': 200,
                'responseMsg': "User find",
                data:       rows
            })
        }
    })
})

module.exports = router;