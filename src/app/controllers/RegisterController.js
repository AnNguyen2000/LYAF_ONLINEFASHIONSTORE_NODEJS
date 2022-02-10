const accModel = require("../models/Account");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
class RegisterController {
  accessRegister(req, res, next) {
    res.render("register");
  }

  checkRegister(req, res, next) {
    const rname = req.body.rname;
    const rusername = req.body.rusername;
    const rpassword = req.body.rpassword;
    const rpasswordcheck = req.body.rpasswordcheck;
    var error;
    var valuename;
    var valueuser;
    if (rusername == "" || rpassword == "") {
      error = "Tài khoản hoăc mật khẩu đang trống !";
      valuename = rname;
      valueuser = rusername;
      res.render("register", { error, valuename, valueuser });
    } else if (rpassword.length < 8) {
        error = "Mật khẩu phải nhiều hơn 8 ký tự !";
        valuename = rname;
        valueuser = rusername;
        res.render("register", { error, valuename, valueuser });
    }  else if (rpassword != rpasswordcheck) {
      error = "Xác nhận mật khẩu thất bại !";
      valuename = rname;
      valueuser = rusername;
      res.render("register", { error, valuename, valueuser });
    } else {
      accModel
        .findOne({ username: rusername })
        .exec()
        .then((data) => {
          if (data != null) {
            error = "Tên đăng nhập đã được sử dụng !";
            valuename = rname;
            valueuser = rusername;
            res.render("register", { error, valuename, valueuser });
          } else {
            const bcryptpassword = bcrypt.hashSync(rpassword, 10);
            const newacc = new accModel({
              username: rusername,
              password: bcryptpassword,
            });
            newacc
              .save()
              .then(() => {
                const newuser = new userModel({
                  _id: rusername,
                  name: rname,
                  role: "user",
                });
                newuser
                  .save()
                  .then(() => {
                    res.render("login");
                  })
                  .catch();
              })
              .catch(next);
          }
        })
        .catch();
    }
  }
}

module.exports = new RegisterController();
