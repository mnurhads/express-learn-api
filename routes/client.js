const express = require('express')
const router  = express.Router()

const connect = require('../config/db')
const { body, validationResult } = require('express-validator');
const req = require('express/lib/request');

const jwtVerif = require('../setting/jwt')

router.post('/', jwtVerif, function(req, res) {
    connect.query(`SELECT id AS clientId, name AS clientName, email AS clientEmail, phone AS clientPhone, image AS clientImage FROM clients ORDER BY id ASC`, function(err, rows) {
        if(err) {
            return res.status(500).json({
                'responseCode': 500,
                'responseMsg': 'Invalid query prosess'
            })
        } else {
            if(rows.length < 1) {
                return res.status(404).json({
                    'responseCode': 404,
                    'reponseMsg': 'Data Client tidak tersedia'
                })
            } else {
                return res.status(200).json({
                    'responseCode': 200,
                    'responseMsg': 'List data client',
                    'data': rows[0]
                })
            }
        }
    })
})

router.post('/create', [
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('phone').notEmpty(),
], jwtVerif, function(req, res) {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let formData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }

    connect.query(`SELECT * FROM clients WHERE email = '${formData.email}' OR phone = '${formData.phone}'`, formData, function(err, rows) {
        if(err) {
            return res.status(500).json({
                status: false,
                message: err,
            })
        }

        if(rows.length > 0) {
            return res.status(404).json({
                'responseCode': 404,
                'responseMsg': 'Email / No telpon sudah terdaftar sebagai client'
            });
        } else {
            // return res.status(200).json({
            //     'responseCode': 200,
            //     'responseMsg': rows
            // });
            connect.query(`INSERT INTO clients SET ?`, formData, function(err, rows) {
                if(err) {
                    return res.status(500).json({
                        'responseCode': 500,
                        'responseMsg': 'Insert Client Failed'
                    });
                } else {
                    return res.status(200).json({
                        'responseCode': 200,
                        'responseMsg': 'Insert Client Successfully'
                    });
                }
            })
        }
    })
})

module.exports = router