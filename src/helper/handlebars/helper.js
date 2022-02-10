const cloudinary = require('../../config/cloudinary')
module.exports = {
    equals: (options) =>{ 
        return options.hash.val1 === options.hash.val2 ? options.fn(this) : options.inverse(this) 
    },
    numberEquals: (options) =>{ 
        return Number.parseInt(options.hash.val1) === Number.parseInt(options.hash.val2) ? options.fn(this) : options.inverse(this) 
    },
    notEquals: (options) =>{ return options.hash.val1 !== options.hash.val2 ? options.fn(this) : options.inverse(this) },
    manyEqTo: (options) => {
        return (options.hash.val1 === options.hash.key ||  options.hash.val2 === options.hash.key) ? options.fn(this) : options.inverse(this)
    },
    getThumbnails: (option) => {
        return `<a href="/product/detail/${option.hash.id}"><img src="${option.hash.images[0]}" id="main-thumbnail"></a><a href="/product/detail/${option.hash.id}"><img src="${option.hash.images[1]}" id="second-thumbnail"></a>`
    },
    getData: (option)=>{
        return option.hash.data[option.hash.indx]
    },
    getSize: (option)=>{
        var size = []
        option.hash.subProduct.forEach(_ => {
            if (!size.includes(_.sizeId)){
                size.push(_.sizeId)
            }
        })
        var result = ''
        size.forEach( (item) => {
            result += option.fn(item);
          });
          return result;
    },
    getColor: (option)=>{
        var color = []
        option.hash.subProduct.forEach(_ => {
            if (!color.includes(_.colorId)){
                color.push(_.colorId)
            }
        })
        var result = ''
        color.forEach( (item) => {
            result += option.fn(item);
          });
          return result;
    },
    ratingStar: (option)=>{
        var rateStar = ''
        const val = option.hash.value
        for (var i = 0; i < 5; i++) {
            if (val - i >= 1) {
                rateStar += '<span><i class="fas fa-star"></i></span>';
            } else if (val - i > 0 && val - i < 1) {
                rateStar +=  '<span><i class="fas fa-star-half-alt"></i></span>';
            } else {
                rateStar += '<span><i class="far fa-star"></i></span>';
            }
        }
        return rateStar
    },
    priceFormat: (option)=>{
        var price = option.hash.price*1000
        price = price.toLocaleString('it-IT');
        return price
    },
    
    saleFormat: (option)=>{
        var price = option.hash.price - option.hash.sale * option.hash.price
        price = (price*1000).toLocaleString('it-IT');
        return price
    },

    operator: (option)=>{
        var operation = option.hash.op
        var val1 = option.hash.val1
        var val2 = option.hash.val2
        switch(operation){
            case "+":
                return val1 + val2
            case "-":
                return val1 - val2
            case "*":
                return val1 * val2
            case "/":
                return val1 / val2
        }
    }
    ,

    billStatus: (option)=>{
        switch(option.hash.state){// 0: Huỷ đơn hàng ,1: Đang chờ xử lý, 2: Đã xác nhận đơn hàng, 3: Đang vận chuyển, 4: Đã giao hàng
            case 0:
                return "Đã huỷ đơn hàng"
            case 1:
                return "Đang chờ xử lý"
            case 2:
                return "Đã xác nhận đơn"
            case 3:
                return "Đang vận chuyển"
            case 4:
                return "Giao hàng thành công"
            case 5:
                return "Giao hàng thất bại"
        }
    },

    whatRole: (option)=>{
        switch(option.hash.role){// 0: Huỷ đơn hàng ,1: Đang chờ xử lý, 2: Đã xác nhận đơn hàng, 3: Đang vận chuyển, 4: Đã giao hàng
            case "NVVC":
                return "Nhân viên vận chuyển"
            case "admin":
                return "ADMIN"
            case "NVSP":
                return "Nhân viên quản lý sản phẩm"
            case "NVDH":
                return "Nhân viên đơn hàng"
            case "user":
                return "Thành viên"
        }
    },

    dateFormat: (option) => {
        return option.hash.date.toLocaleString('vi-VN')
    },

    salePercentFormat: (data)=> {
        return data*100;
    },

    imageName:  (option)=>{
        const url = option.hash.url
        var n = url.lastIndexOf('/');
        var result = url.substring(n + 1);
        return `
            <span class="image-info font-weight-bold">
            <span class="LYAF-asssA">
                <span id="thumbnail"></span>
            </span>
            <span id="name">${result}</span>
            <span id="size" data-url="${url}"></span>
        </span>
        `
    }

}
