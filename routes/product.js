const express = require('express');
const router  = express.Router();

//import database
const connect = require('../config/db');
const { body, validationResult } = require('express-validator');
const req = require('express/lib/request');
const { route } = require('express/lib/application');

// GET DATA

router.get('/', function(req, res){
    connect.query("SELECT * FROM rooms ORDER BY id DESC", function(err, rows){
        if (err) {
            return res.status(500).json({
                status:       false,
                message:      'Internal Server Error'
            })
        } else {
            return res.status(200).json({
                status:     true,
                message:    'List data product',
                data:       rows
            })
        }
    });
});

// INSERT DATA
router.post('/store', [
    // validation
    body('name').notEmpty(),
    body('floor').notEmpty(),
    body('type').notEmpty(),
    body('beds').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    // define formData
    let formData = {
        name: req.body.name,
        floor: req.body.floor,
        type: req.body.type,
        beds: req.body.beds,
    }

    // insert query
    connect.query("INSERT INTO rooms SET ?", formData, function(err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            })
        } else {
            return res.status(200).json({
                status:     true,
                message:    "Insert Room Successfully",
                data:       rows[0]
            })
        }
    })
})

// SHOW DATA
router.get('/(:id)', function (req, res) {
    let id = req.params.id;

    connect.query(`SELECT * FROM rooms WHERE id = ${id}`, function( err, rows) {
        if( err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            })
        } 

        // validasi data
        if (rows.length < 1) {
            return res.status(404).json({
                status: false,
                message: "Data Room Tidak Ditemukan",
            })
        } else {
            return res.status(200).json({
                status:     true,
                message:    'Detail Room',
                data:       rows[0]
            })
        }
    })
})

// UPDATE DATA
router.patch('/update/:id', [
    // validation
    body('name').notEmpty(),
    body('floor').notEmpty(),
    body('type').notEmpty(),
    body('beds').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    // id room
    let id = req.params.id;

    // data room
    let formData = {
        name: req.body.name,
        floor: req.body.floor,
        type: req.body.type,
        beds: req.body.beds,
    }

    connect.query(`UPDATE rooms SET ? WHERE id = ${id}`, formData, function(err, rows) {
        if( err ) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: "Updated Room Succesfully",
                data: rows[0]
            })
        }
    })
});

// DELETE DATA
router.delete('/delete/(:id)', function(req, res) {
    let id = req.params.id;

    connect.query(`SELECT * FROM rooms WHERE id = ${id}`, function( err, rows) {
        if (rows.length < 1) {
            return res.status(404).json({
                status: false,
                message: "Data Room Tidak Ditemukan",
            })
        }
    })

    connect.query(`DELETE FROM rooms WHERE id = ${id}`, function(err, rows) {
        if(err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            })
        } else {
            return res.status(200).json({
                status: true,
                message: `Delete Room ID ${id} Successfully`,
                data: rows[0]
            })
        }
    })
})

module.exports = router;