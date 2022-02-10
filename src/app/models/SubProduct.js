//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const SubProduct = new Schema({
    _id: {type: mongoose.Schema.Types.String},
    productId:{type: mongoose.Schema.Types.String, ref:'Product'},
    colorId:{type: mongoose.Schema.Types.String, ref:'Color'},
    sizeId:{type: mongoose.Schema.Types.String, ref:'Size'},
    quantity:{type: mongoose.Schema.Types.Number},
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
SubProduct.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('SubProduct',SubProduct);