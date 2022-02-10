//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const Category = new Schema({
    _id: {type: mongoose.Schema.Types.String},
    name: {type: mongoose.Schema.Types.String},
    parentId: {type: mongoose.Schema.Types.String, ref: 'Category'},
    numberOfProd: {type: mongoose.Schema.Types.Number, default: 0},
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
Category.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('Category', Category);