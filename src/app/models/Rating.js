//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const Rating = new Schema({
    userRating: {type: mongoose.Schema.Types.String, ref: 'User'},
    productRating: {type: mongoose.Schema.Types.String, ref: 'Product'},
    value: { type: mongoose.Schema.Types.Number }
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
Rating.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('Rating', Rating);