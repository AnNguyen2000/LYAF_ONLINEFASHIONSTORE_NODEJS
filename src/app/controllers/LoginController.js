const express = require('express');
const app = express();
class LoginController{

    login(req,res,next){
        
        res.render('login');
    }
    // register(req,res,next){
    //     res.render('register');
    // }
    loginSuccess(req,res,next){
        res.render('home');
    }
    
    checkLogin(req,res,next){
        const error = req.flash('error')[0];
        res.render('login', {error});
    }

    test(req,res,next){
    }


        // passport.serializeUser((user,done) =>{
        // done(null,user.usr);
        // });

        // passport.deserializeUser((name,done) =>{
        // fs.readFile('db',()=>{
        //     const db = JSON.parse(data);
        //     const userc = db.find(user => user.usr == name);
        //     if(userc){
        //     return done(null,userc);
        //     }
        //     else{
        //     return done(null,falses);
        //     }
        // });
        // })

        // app.get('pricv',(q,s)=>{
        // if(q.isAuthenticated()){
            
        // }
        // })
    
}

module.exports = new LoginController;