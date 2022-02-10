//Require Route:
const express = require('express');
const route = express.Router();
const multer = require('../middleware/multer');
//Require controller:
const proManager = require('../app/controllers/ManagementController');

route.get('/account',proManager.account);
route.post('/accountManager',proManager.accManager);
route.post('/addaccount',proManager.addacc);
route.post('/deleteaccount',proManager.deleteacc);
route.post('/updateaccount',proManager.updateacc);

module.exports = route;