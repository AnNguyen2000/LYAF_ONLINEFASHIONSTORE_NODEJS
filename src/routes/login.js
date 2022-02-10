const express = require('express');
const app = express();
const route = express.Router();
const passport = require('passport');
const LoginController = require('../app/controllers/LoginController');

///////

route.get('/',LoginController.login);
route.get('/success',LoginController. loginSuccess);
route.get('/test',LoginController.test);
route.get('/check',LoginController.checkLogin);
route.get('/facebook', passport.authenticate('facebook',{scope: 'email' }));
route.get('/facebook/callback',passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login',failureFlash : true}));
route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
route.get('/google/callback', passport.authenticate('google', {  successReturnToOrRedirect: '/',  failureRedirect: '/login', failureFlash : true }));
route.post('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login/check', failureFlash : true, badRequestMessage: 'Tài khoản hoăc mật khẩu đang trống !' }));

//
module.exports = route;