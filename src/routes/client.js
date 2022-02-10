const express = require('express');
const route = express.Router();
const ClientController = require('../app/controllers/ClientController');
const authen = require('../middleware/authen')
route.get('/', authen.authen, ClientController.client);
route.get('/product/detail/:id', authen.authen, ClientController.productDetail);
route.get('/product/collection', authen.authen, ClientController.productCollection);
route.post('/search', authen.authen, ClientController.search);
route.get('/404', authen.authen,ClientController.notfound)
module.exports = route;