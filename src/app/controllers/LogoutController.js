const express = require('express');
const app = express();
class LogoutController{

    logout(req,res,next){
        req.logout()
        res.redirect('/');
    }
}

module.exports = new LogoutController;