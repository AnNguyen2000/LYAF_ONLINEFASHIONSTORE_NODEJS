const express = require('express');
const route = express.Router();

const ColorController = require('../app/controllers/ColorController');

route.get('/', ColorController.getList);

module.exports = route;