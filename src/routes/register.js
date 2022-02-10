const express = require('express');
const app = express();
const route = express.Router();
const passport = require('passport');
const RegisterController = require('../app/controllers/RegisterController');

route.get('/',RegisterController.accessRegister);
route.post('/check',RegisterController.checkRegister);

module.exports = route;