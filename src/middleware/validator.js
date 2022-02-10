const { check } = require("express-validator")
const ColorDAO = require('../app/repo/ColorDAO')
const SizeDAO = require('../app/repo/SizeDAO')
const CategoryDAO = require('../app/repo/CategoryDAO')
const ProductDAO = require('../app/repo/ProductDAO')

const alphaAndSpace = (string)=> {
    for (i = 0; i < string.length; i++ ) {
        var key = string.charCodeAt(i)
        if ((key >= 33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 126)){
            return false
        }
    }
    return true
  };

module.exports = {
    productValidator: () => {
        return [
            // CHECK NAME
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên sản phẩm"),

            // CHECK PRICE
            check("price").not().isEmpty().withMessage("Vui lòng nhập giá sản phẩm"),
            check("price").isNumeric().withMessage("Giá sản phẩm không được chứa ký tự đặc biệt"),

            // CHECK CATEGORY ID
            check("categoryId").not().isEmpty().withMessage("Vui lòng chọn loại sản phẩm"),
            check("categoryId").custom(async (value) => {
                var category = await CategoryDAO.findById(value)
                if (!category) {
                    return Promise.reject();
                }
              }).withMessage("Loại mã sản phẩm không đúng"),

            // CHECK DESCRIPTION
            check("desc").not().isEmpty().withMessage("Vui lòng nhập giới thiệu sản phẩm"),

            // CHECK SUB PRODUCTS
            check("subProduct").custom((value) => {
                if (!Array.isArray(value)){
                    value = [value]
                }
                var jsonVal = value.map(v=>JSON.parse(v))
                for(val of jsonVal){
                    if (!(val.colorId && val.sizeId && val.quantity)){
                        return false
                    }
                }
                return true
              }).withMessage("Sản phẩm phụ không hợp lệ"),

            check("subProduct").custom((value) => {
                if (!Array.isArray(value)){
                    value = [value]
                }
                var jsonVal = value.map(v=>JSON.parse(v))
                for(v1 of jsonVal){
                    var count = 0
                    for (v2 of jsonVal){
                        if (v1.colorId == v2.colorId && v1.sizeId == v2.sizeId){
                            count+=1
                            if (count >= 2)
                            return false
                        }
                    }
                }
                return true
            }).withMessage("Sản phẩm phụ trùng"),
            check("subProduct").custom(async (value) => {
                if (!Array.isArray(value)){
                    value = [value]
                }
                var jsonVal = value.map(v=>JSON.parse(v))
                for(val of jsonVal){
                    var checkColor = await ColorDAO.findById(val.colorId)
                    var checkSize = await SizeDAO.findById(val.sizeId)
                    if (!checkColor||!checkSize){
                        return Promise.reject()
                    }
                }
            }).withMessage("Màu sắc hoặc size không tồn tại"),
        ]
    },
    registryValidator: () => {
        return [
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên phòng/khoa"),
            check("name").custom( (value, {req}) => {
                return alphaAndSpace(value)
              }).withMessage("Tên phòng/khoa không được chứa số hoặc ký tự đặc biệt"),

            check("email").not().isEmpty().withMessage("Vui lòng nhập email"),
            check("email").isEmail().withMessage("Email không hợp lệ"),

            check("username").not().isEmpty().withMessage("Vui lòng nhập tên đăng nhập phòng/khoa"),
            check("username").isLength({min: 6, max: 18}).withMessage("Tên đăng nhập phải lớn hơn 6 và nhỏ hơn 18 ký tự"),
            check("username").not().matches("[^A-Za-z0-9]").withMessage("Tên đăng nhập không được chứa ký tự đặc biệt"),

            check("password").not().isEmpty().withMessage("Vui lòng nhập mật khẩu phòng/khoa"),
            check("password").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("password").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),

            check("passwordConfirm").not().isEmpty().withMessage("Vui lòng nhập mật khẩu phòng/khoa"),
            check("passwordConfirm").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("passwordConfirm").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),
            check("passwordConfirm").custom( (value, {req}) => {
                return value===req.body.password
              }).withMessage("Mật khẩu nhập lại không khớp"),

            
            check("id").not().isEmpty().withMessage("Không được để trống mã phòng"),
            check("id").isAscii().withMessage("Mã phòng không được chưa dấu"),
            check("id").not().matches("[^A-Za-z0-9]").withMessage("Mã phòng không chứa ký tự đặc biệt"),
        ] 
    },
    subProductValidator: () => {
        return [
            check("productId").not().isEmpty().withMessage("Mã sản phẩm không được để trống"),
            check("productId").custom(async (value) => {
                var product = await ProductDAO.findById(value)
                if (!product) {
                    return Promise.reject();
                }
              }).withMessage("Loại mã sản phẩm không đúng"),
            
            check("colorId").not().isEmpty().withMessage("Mã màu không được để trống"),
            check("colorId").custom(async (value) => {
                var color = await ColorDAO.findById(value)
                if (!color) {
                    return Promise.reject();
                }
              }).withMessage("Mã màu không tồn tại"),
            

    ] },
    cartValidator: () => {
        return [
            check("productId").not().isEmpty().withMessage("Mã sản phẩm không được để trống"),
            check("productId").custom(async (value) => {
                var product = await ProductDAO.findById(value)
                if (!product) {
                    return Promise.reject();
                }
              }).withMessage("Loại mã sản phẩm không đúng"),
            
            check("colorId").not().isEmpty().withMessage("Mã màu không được để trống"),
            check("colorId").custom(async (value) => {
                var color = await ColorDAO.findById(value)
                if (!color) {
                    return Promise.reject();
                }
              }).withMessage("Mã màu không tồn tại"),
            
            check("sizeId").not().isEmpty().withMessage("Mã size không được để trống"),
            check("sizeId").custom(async (value) => {
                var size = await SizeDAO.findById(value)
                if (!size) {
                    return Promise.reject();
                }
            }).withMessage("Mã size không tồn tại"),
            
            check("quantity").not().isEmpty().withMessage("Vui lòng nhập số lượng sản phẩm"),
            check("quantity").isNumeric().withMessage("Só lượng sản phẩm phải là số"),
            check("quantity").custom( (value) => {
                return Number.parseInt(value) > 0
            }).withMessage("Số lượng phải lớn hơn 0"),

    ] },
    
    checkOutValidator: () => {
        return [
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên người nhận"),

            check("phone").not().isEmpty().withMessage("Vui lòng nhập số điện thoại"),

            check("address").not().isEmpty().withMessage("Vui lòng nhập địa chỉ"),

            check("province").not().isEmpty().withMessage("Vui lòng chọn Tỉnh / Thành"),
            
            check("district").not().isEmpty().withMessage("Vui lòng chọn Quận / Huyện"),

            check("ward").not().isEmpty().withMessage("Vui lòng chọn Phường / Xã"),

            check("payment").not().isEmpty().withMessage("Vui lòng phương thức thanh toán"),
    ]},
    
    updateProfile: () => {
        return [
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên người dùng"),
            check("name").custom( (value, {req}) => {
                return alphaAndSpace(value)
              }).withMessage("Tên người dùng không được chứa ký tự đặc biệt"),
            
    ] },

    updatePassword: () => {
        return [
            check("oldPassword").not().isEmpty().withMessage("Vui lòng nhập mật khẩu cũ"),
            check("oldPassword").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("oldPassword").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),
            
            check("newPassword").not().isEmpty().withMessage("Vui lòng nhập mật khẩu mới"),
            check("newPassword").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("newPassword").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),
            
            check("reNewPassword").not().isEmpty().withMessage("Vui lòng nhập lại mật khẩu"),
            check("reNewPassword").custom((value, {req}) => {
                return value===req.body.newPassword
              }).withMessage("Mật khẩu nhập lại không khớp"),
        ]
    }

}