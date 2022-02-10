//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete
const { randomString } = require('../../helper/function')
//Connect DB:
const Bill = new Schema({
    _id: {type: mongoose.Schema.Types.String, default: randomString},
    user: {type: mongoose.Schema.Types.String, ref: 'User'},
    shipProfile: {
        province: {type: mongoose.Schema.Types.String, ref: 'Province'},
        distric: {type: mongoose.Schema.Types.String, ref: 'District'},
        ward: {type: mongoose.Schema.Types.String, ref: 'Ward'},
        address: {type: mongoose.Schema.Types.String},
        name: {type: mongoose.Schema.Types.String},
        phone: {type: mongoose.Schema.Types.String}
    },
    totalPrice: {type: mongoose.Schema.Types.Number},
    state: {type: mongoose.Schema.Types.Number, enum: [0, 1, 2, 3, 4, 5]}, // 0: Huỷ đơn hàng ,1: Đang chờ xử lý, 2: Đã xác nhận đơn hàng, 3: Đang vận chuyển, 4: Đã giao hàng, 5: Giao hàng thất bại
    paymentType: {type: mongoose.Schema.Types.Number, enum: [0, 1]}, // 0: COD, 1: MOMO
    alreadyPay: {type: mongoose.Schema.Types.Boolean},
    manageAssigned: {type: mongoose.Schema.Types.Boolean, default: false},
    shipAssigned: {type: mongoose.Schema.Types.Boolean, default: false},
    date: {type: Date, default: Date.now()}
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
Bill.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('Bill', Bill);