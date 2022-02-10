//B1: npm i express
//B2:npm nodemon ("start": "nodemon src/index.js", "main":"src/index.js")
//B3:npm i express-handlebars
//B4: tạo file resources - [scss + views]
//B5: tạo file layouts trong views
//B6: tạo file public - [img]
//B7: require node-sass (npm install node-sass --save-dev)
//B8: tạo file app.scss trong file scss 
//B9: tạo file css trong public và đăt tên file css giống với file scss ("watch": "node-sass --watch src/resources/scss/ -o src/public/css/") 
//B10: npm run watch
//B11: cài boostrap (css & js)
//B12:Tạo file routes - [index.js + route files]
//B13:tạo file app - controllers - [controller files]
//B14: Tạo middleware cho phương thức post:
//B15: connect MongoBD (npm i mongoose)
//B16:Tạo file config - db - index.js - Nhập code connect MongoDB
//B17:Require link connect DB
//B18:Tạo file models trong app - (tên collection viết hoa chữ cái đầu và bỏ s).js - Nhập code tạo model mới Schema mongoose
//B19:Cài mongoose soft delete (npm install mongoose-delete)
//B20:require mongoose-delete vào model và add plugin
//B21: cài method-override (npm install method-override)
//B22: Require method-override
//B23: Tải gói passport
//B23: Lưu ý đúng thứ tự require tất cả

//Require express:
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const hdbHelper = require('./helper/handlebars/helper')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
require("dotenv").config();
//Require handlebars:
const hdbars = require('express-handlebars');
const path = require('path');
app.use('/css',express.static(__dirname +'/css'));
app.use(express.static(path.join(__dirname,'public')));

////set engine (handlebars):
app.engine('handlebars',hdbars({
  helpers: hdbHelper
}));
app.set('view engine','handlebars');
app.set('views',path.join(__dirname, 'resources/views'));


//use express middleware:
app.use(express.urlencoded({
    extended:true,
    limit: '50mb'
  }));
app.use(express.json({limit: '50mb'}));

//method Override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
//Set up Passport:
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'yamete kudasai',
                  resave: true,
                  saveUninitialized: true,
                  cookie:{
                    maxAge:6000000,
                  }}));
app.use(flash());
app.use(passport.initialize()); 
app.use(passport.session());

require('./config/passport');
const port = process.env.PORT;
console.log(port)
//route:
const route = require('./routes/index');
route(app);

//Connect MonngoDB:
const connect_db = require('./config/db/index.js');
connect_db();


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // // res.status(err.status || 500);
  res.status(404).render('404');
});


//Listen port:
app.listen(port, () => {console.log("http://localhost:"+port)});