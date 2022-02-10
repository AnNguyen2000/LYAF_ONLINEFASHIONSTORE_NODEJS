module.exports = {
    authen: (req, res, next) => {
        req.params.boss = 0;
        if(req.user){
            if(req.user.role == 'user'){
                next();
            }
            else{
              req.params.boss = 1;
              next();
            }
        }else
        next()
    },
    apiAuthenLogin: (req, res, next)=>{
        if (req.user){
            res.status(200).json({code: 200, message:"Ok"})
        }else{
            res.status(401).json({code: 401, message:"Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng chức năng này"})
        }
    },
    authenLogin2: (req, res, next) => {
        if (req.user){
            next()
        }else{
            res.status(404).redirect('/')
        }
    },
    authenLogin3: (req, res, next) => {
        if (req.user){
            res.status(200)
            next()
        }else{
            res.status(401).json({code: 401, message:"Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng chức năng này"})
        }
    },

    authenManager: (req, res, next) => {
        if (req.user.role === "NVDH"|| req.user.role === "admin"){
            next()
        }else{
            res.status(401).render('404')
        }
    },

    authenShipper: (req, res, next) => {
        if (req.user.role === "NVVC"|| req.user.role === "admin"){
            next()
        }else{
            res.status(401).render('404')
        }
    },

    authenProductManager: (req, res, next) => {
        if (req.user.role === "NVSP"|| req.user.role === "admin"){
            next()
        }else{
            res.status(401).render('404')
        }
    },

    authenAdmin: (req, res, next) => {
        if (req.user.role === "admin"){
            next()
        }else{
            res.status(401).render('404')
        }
    },

    apiAuthenShipper: (req, res, next) => {
        if (req.user.role === "NVVC"|| req.user.role === "admin"){
            next()
        }else{
            res.status(401).json({code: 401, message:"Unauhorized"})
        }
    },

    apiAuthenManager: (req, res, next) => {
        if (req.user.role === "NVDH"|| req.user.role === "admin"){
            next()
        }else{
            res.status(401).json({code: 401, message:"Unauhorized"})
        }
    },


    authenBoss: (req, res, next) => {
        if (req.user.role === "NVSP" || req.user.role === "admin" || req.user.role === "NVVC" || req.user.role === "NVDH"){
            next()
        }else{
            res.status(401).render('404')
        }
    },

}