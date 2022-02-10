const accModel = require("../app/models/Account");
const userModel = require("../app/models/User");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
//FacebookStrategy
passport.use(new FacebookStrategy({
  clientID:"604154980823984",
  clientSecret:"4c064c7003a4cd965a2fe510a77ada4a",
  callbackURL: "http://localhost:2000/login/facebook/callback"
},
async(accessToken, refreshToken, profile, done) => {

  var json = profile._json;
  accModel.findOne({username: json.id})
  .exec()
    .then((data) =>{
      if(data == null){
        const newacc = new accModel({
          username: json.id,
        })
        newacc.save()
              .then(()=>{
                const newuser = new userModel({
                  _id: json.id,
                  name:json.name,
                  role:"user"
                })
                newuser.save();
                return done(null,newuser);
              })
              .catch((err) =>{
                return done(null,err);
              })
      }
      else{
        userModel.findOne({_id: data.username})
        .exec()
        .then((data) =>{
          return done(null,data);
        })
       .catch((err)=>{
         return done(null,err);
       })
      }
    })
}
));
//End Facebook
//GoogleStrategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:2000/login/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      accModel.findOne({username : profile._json.sub})
      .exec()
      .then((data) => {
          if(data == null){
            const newacc = new accModel({username: profile._json.sub})
            .save()
            .then(()=>{
              const newuser = new userModel({
                _id: profile._json.sub,
                name:profile._json.name,
                role:'user'
              })
              newuser.save()
              return done(null, newuser); 
            })
            .catch((err)=>{
              return done(null,err);
            })
          }
          else{
            userModel.findOne({_id: data.username})
            .exec()
            .then((data) =>{
              return done(null, data);
            })
            .catch((err) =>{
              return done(null,err);
            })
         
          }
      })
      .catch((err)=>{
          return done(null,err)
      })                                        
      
    }
  )
);
//End Google

//LocalStrategy
passport.use(
  new LocalStrategy(
    {
      // usernameField: "username",
      // passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      if (username == "" || password == "") {
        req.flash("error", "Tài khoản hoăc mật khẩu đang trống !");
        return done(null, false);
      } else {
        accModel
          .findOne({
            username: username,
          })
          .exec()
          .then((data) => {
            if (data == null) {
              req.flash("error", "Tài khoản không hợp lệ !");
              return done(null, false);
            } else if (bcrypt.compareSync(password, data.password)) {
              console.log('data.password',data.password);
              userModel
                .findOne({ _id: username })
                .exec()
                .then((user) => {
                  return done(null, user);
                });
            } else {
              req.flash("error", "Mật khẩu không hợp lệ !");
              return done(null, false);
            }
          })
          .catch(function (err) {
            return done(null, err);
          });
      }
    }
  )
);
//End Local