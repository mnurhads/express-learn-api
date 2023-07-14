const express = require('express');
const router  = express.Router();

//import database
const connect = require('../config/db');
const { body, validationResult } = require('express-validator');
const req = require('express/lib/request');
const dotenv = require('dotenv');
// setup global
dotenv.config();

// import jwt
const   jwt         = require('jsonwebtoken')
const   jwtExp      = 300
const   jwtVerif    = require('../setting/jwt')

// import cogs
const setting      = require('../setting/cogs');

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
            // proses update token
            // proses jwt
            const token = jwt.sign({formData}, process.env.SECRET_KEY, {
                algorithm: "HS256",
                expiresIn: jwtExp
            })

            connect.query(`UPDATE users SET jwt = '${token}' WHERE name = '${formData.name}'`, formData)

            return res.status(200).json({
                'responseCode': 200,
                'responseMsg': "Successfull Login",
                'data': {
                    'accessToken': token,
                    'tokenType': 'Bearer',
                    'expiredAt':     jwtExp,
                    'scope': {
                        "grantType": "client_credentials"
                    }
                },

            })

            // set cookie
            res.cookie("token", token, { maxAge: jwtExp * 1000 })
            res.end()
        }
    })
})

router.post("/register", [
    body("username").notEmpty(),
    body("email").notEmpty(),
    body("password").notEmpty(),
    body("konfirm").notEmpty()
], (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    if (req.body.password != req.body.konfirm) {
        return res.status(402).json({
            "responseCode": 402,
            "responseMsg": "Password yang dimasukkan tidak sama"
        })
    }

    // hash
    var data = req.body.password;
    var crypto = require('crypto');
    passHex = crypto.createHash('md5').update(data).digest("hex");
    // end

    // define formdata
    let formData = {
        name: req.body.username,
        email: req.body.email,
        password: passHex,
        remember_token: setting.makeid(85)
    }

    // cek ketersedian user / empty user
    connect.query(`SELECT * FROM users WHERE name = '${formData.name}' AND email = '${formData.email}'`, formData, function(err, rows) {
        if (rows.length >= 1) {
            return res.status(201).json({
                'responseCode': 201,
                'responseMsg': "User sudah ada",
            })
        } else {
            connect.query(`INSERT INTO users SET ?`, formData, function(err, row) {
                if(err) {
                    return res.status(500).json({
                        "responseCode": 500,
                        "responseMsg": err,
                    })
                } else {
                    return res.status(200).json({
                        "responseCode": 200,
                        "responseMsg": "Register Success",
                        "data": row[0]
                    })
                }
            })
        }
    })
    // end
})

router.get("/valid", jwtVerif, (req, res) => {
    res.status(200).json({"responseCode": 200, "responseMsg": "Validated Match!!"});
});

// update profil
router.patch('/profil/update/:token', [
    body("username").notEmpty(),
    body("email").notEmpty(),
    body("notelp").notEmpty(),
    body("nik").notEmpty(),
    body("fullname").notEmpty(),
], (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let token = req.params.token;

    let formData = {
        name:     req.body.username,
        fullname: req.body.fullname,
        email:    req.body.email,
        notelp:   req.body.notelp,
        nik:      req.body.nik
    }

    connect.query(`UPDATE users SET ? WHERE remember_token = '${token}'`, formData, function(err, rows) {
        if (err) {
            return res.status(500).json({
                'responseCode': 500,
                'responseMsg': err
            })
        } else {
            return res.status(200).json({
                'responseCode': 200,
                'responseMsg': 'Updated Successfully'
            })
        }
    })
})

module.exports = router;