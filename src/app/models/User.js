//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const User = new Schema({
    _id: {type:String},
    name:{type:String},
    role:{type:String},//admin|staff|user
    birthday:{type:mongoose.Schema.Types.Date},
    phoneNumber: {type: mongoose.Schema.Types.String},
    email:{type:String},
    address: [{type: mongoose.Schema.ObjectId, ref: 'ShipProfile'}],
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
User.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('User', User);