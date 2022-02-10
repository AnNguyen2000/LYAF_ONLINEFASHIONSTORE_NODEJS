//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const Color = new Schema({
    _id: {type: mongoose.Schema.Types.String},
    name: {type: mongoose.Schema.Types.String},
    thumbnail: {type: mongoose.Schema.Types.String},
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
Color.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('Color', Color);