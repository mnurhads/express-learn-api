const express = require('express')
const router  = express.Router()

const config  = require('../config/db')
const { body, validationResult } = require('express-validator');
const req = require('express/lib/request');

const jwtVerif = require('../setting/jwt')

