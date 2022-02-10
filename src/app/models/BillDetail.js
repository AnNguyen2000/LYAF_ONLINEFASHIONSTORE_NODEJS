//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const BillDetail = new Schema({
    bill: {type: mongoose.Schema.Types.String, ref: 'Bill'},
    subProdId: {type: mongoose.Schema.Types.String, ref: 'SubProduct'},
    quantity: {type: mongoose.Schema.Types.Number},
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
BillDetail.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('BillDetail', BillDetail);