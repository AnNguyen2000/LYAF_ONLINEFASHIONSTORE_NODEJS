//Require Route:
const express = require('express');
const route = express.Router();
const multer = require('../middleware/multer');
//Require controller:
const proManager = require('../app/controllers/ManagementController');
const authen = require('../middleware/authen')

//Body
route.get('/',proManager.proManager);
route.get('/add', authen.authenProductManager, proManager.create);
route.get('/me',authen.authenLogin2 ,proManager.me);
route.get('/list/detail/:id', authen.authenProductManager,proManager.productDetail);
route.get('/list', authen.authenProductManager,proManager.list);
route.get('/bill/ship',authen.authenShipper ,proManager.ship);
route.get('/bill/manage',authen.authenManager,proManager.manage);
route.get('/bill/manageDetail/:id',authen.authenManager,proManager.manageDetail);
route.get('/bill/shipDetail/:id',authen.authenShipper,proManager.shipDetail);
route.get('/bill/detail/:id',authen.authenAdmin ,proManager.billDetail);
route.get('/bill',authen.authenAdmin ,proManager.bill);
route.get('/property', authen.authenProductManager,proManager.property);
route.post('/sizeManager',proManager.sizeManager);
route.post('/addsize',proManager.addsize);
route.post('/deletesize',proManager.deletesize);
route.post('/updatesize',proManager.updatesize);
route.post('/categoryManager',proManager.categoryManager);
route.post('/categoryParent',proManager.categoryParent);
route.post('/addcategory',proManager.addcategory);
route.post('/deletecategory',proManager.deletecategory);
route.post('/updatecategory',proManager.updatecategory);
route.post('/colorManager',proManager.colorManager);
route.post('/addcolor',multer.single('colorImage'),proManager.addcolor);
route.post('/deletecolor',multer.single('colorImage'),proManager.deletecolor);
route.post('/updatecolor',multer.single('colorImage'),proManager.updatecolor);
route.get('/account',authen.authenAdmin ,proManager.account);
route.get('/accountManager',authen.authenAdmin ,proManager.accManager);
route.get('/accountDetail/:id',authen.authenAdmin ,proManager.accDetail);
route.post('/addaccount',proManager.addacc);
route.post('/deleteaccount',proManager.deleteacc);
route.post('/updateaccount',proManager.updateacc);
route.post('/filteraccount',proManager.filteracc);
module.exports = route;
