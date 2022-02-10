//Require Route:
const express = require('express');
const route = express.Router();

//Require controller:
const SideController = require('../app/controllers/SideController');

//Body
// route.post('/',SideController.checkpass);
route.put('/done',SideController.checkpass);
route.get('/loader',SideController.loader_logo);

module.exports = route;
