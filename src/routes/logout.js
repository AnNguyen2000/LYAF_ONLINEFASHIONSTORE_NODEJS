const express = require('express');
const app = express();
const route = express.Router();
const passport = require('passport');
const LogoutController = require('../app/controllers/LogoutController');

///////

route.get('/',LogoutController.logout);

//
module.exports = route;