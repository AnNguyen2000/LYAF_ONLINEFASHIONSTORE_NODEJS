const express = require('express');
const app = express();
const route = express.Router();
const accModel = require('../app/models/Account');
const userModel = require('../app/models/User');
const authen = require('../middleware/authen')
const UserInfoController = require('../app/controllers/UserInfoController');
route.get('/',
   authen.authenLogin2
   , authen.authen,UserInfoController.start);
route.post('/userInfoUpdate',
    authen.authenLogin2, authen.authen
,UserInfoController.userInfoUpdate);
route.get('/proStatus',authen.authenLogin2, authen.authen,UserInfoController.proStatus);
route.get('/proStatus/proStatusDetail/:id',authen.authenLogin2, authen.authen,UserInfoController.proStatusDetail);
route.get('/changePass',
    authen.authenLogin2, authen.authen,
    (req,res,next)=>{
        accModel.findOne({username: req.user._id}).exec()
        .then((data)=>{
            if(data.password ==null){
                res.redirect('/');
            }
            else{
                next();
            }
        })
    }
,UserInfoController.changePass);
route.post('/changePass/done',
    authen.authenLogin2, authen.authen,
    (req,res,next)=>{
        accModel.findOne({username: req.user._id}).exec()
        .then((data)=>{
            if(data.password ==null){
                res.redirect('/');
            }
            else{
                next();
            }
        })
    }
,UserInfoController.changePassDone);
route.get('/addressList', authen.authenLogin2, authen.authen,UserInfoController.addressList);
route.post('/addressList/add', authen.authenLogin2,UserInfoController.addressListAdd);
route.post('/addressList/updatebefore', authen.authenLogin2,UserInfoController.addressListUpdateBefore);
route.post('/addressList/updateafter', authen.authenLogin2,UserInfoController.addressListUpdateAfter);
route.post('/addressList/delete', authen.authenLogin2,UserInfoController.addressListDelete);

module.exports = route;