//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const ShipConfirm = new Schema({
    user: {type:mongoose.Schema.Types.String, ref: 'User'},
    bill: {type:mongoose.Schema.Types.String, ref: 'Bill'},
    date: {type: Date, default: new Date()}
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
ShipConfirm.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('ShipConfirm', ShipConfirm);