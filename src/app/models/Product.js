//Import library:
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete"); // Require mongoose-delete

//Connect DB:
const Product = new Schema(
  {
    _id: { type: mongoose.Schema.Types.String },
    name: { type: mongoose.Schema.Types.String },
    desc: { type: mongoose.Schema.Types.String },
    categoryId: { type: mongoose.Schema.Types.String, ref: "Category" },
    price: { type: mongoose.Schema.Types.Number },
    images: [{ type: mongoose.Schema.Types.String }],
    isSale: { type: mongoose.Schema.Types.Boolean },
    isNew: { type: mongoose.Schema.Types.Boolean },
    sale: { type: mongoose.Schema.Types.Number },
    rating: { type: mongoose.Schema.Types.Number, default: 0 },
    amountOfAccess: { type: mongoose.Schema.Types.Number },
    subProductCount: { type: mongoose.Schema.Types.Number },
    date: {type: Date, default: Date.now()}
  },
  {
    versionKey: false,
    timestamp: true,
  }
);

// Add plugin mongoose-delete:
Product.plugin(mongooseDelete, {
  overrideMethods: true, //Không hiện thị field bị soft delete
  deletedAt: true, //Thêm 1 key deletedAt
});

module.exports = mongoose.model("Product", Product);
