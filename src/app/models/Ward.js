//Import library:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete'); // Require mongoose-delete

//Connect DB:
const Ward = new Schema({
    _id: {type: mongoose.Schema.Types.String},
    name: {type: mongoose.Schema.Types.String},
    districtCode: {type: mongoose.Schema.Types.String, ref: 'District'}
},{
    versionKey: false,
    timestamp:true
});


// Add plugin mongoose-delete:
Ward.plugin(mongooseDelete, { overrideMethods:true, //Không hiện thị field bị soft delete
                                 deletedAt:true   //Thêm 1 key deletedAt
                                });


module.exports = mongoose.model('Ward', Ward);