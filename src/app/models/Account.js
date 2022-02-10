//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const Account = new Schema({
    username:{type:String},
    password:{type:String},
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
Account.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('Account', Account);