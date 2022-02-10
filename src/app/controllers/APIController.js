const ProductDAO = require("../repo/ProductDAO");
const ColorDAO = require("../repo/ColorDAO");
const SizeDAO = require("../repo/SizeDAO");
const CategoryDAO = require("../repo/CategoryDAO");
const AddressDAO = require("../repo/AddressDAO");
const BillDAO = require("../repo/BillDAO");
const ShipConfirm = require('../models/ShipConfirm')
const { validationResult } = require("express-validator");
const { getPayload, addCart, parseCart, removeCart, parseSearch, updateFiles, parseFilter } = require("../../helper/function");
class APIController {
  async cancelBill(req, res, next) {
    const id = req.body.id
    if (id){
      const result = await BillDAO.updateState(id, 0)
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, message: result.message });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }else{
      res.status(400).json({code: 400, message: "Thông tin không hợp lệ"}) 
    }
  }
  async getSetupList(req, res, next) {
    var colors = await ColorDAO.getList();
    var sizes = await SizeDAO.getList();
    var categories = await CategoryDAO.getList();
    res.status(200).json({ colors, sizes, categories });
  }

  async getCategory(req, res, next) {    
    var categories = await CategoryDAO.getList();
    res.status(200).json({ categories });

  }
  
  async rating(req, res, next){
    console.log(req.body)
    const productId = req.body.productId
    const value = req.body.value
    const result = await ProductDAO.rateProduct(req.user, productId, value)
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, message: result.message });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async getShipperBills(req, res, next){
    console.log(req.user._id)
    const bills = await ShipConfirm.find({user: req.user._id}).sort({date: -1}).populate({
      path: 'bill',
      populate: {
          path: 'shipProfile.province',
      },
    }).populate({
      path: 'bill',
      populate: {
          path: 'shipProfile.distric',
      },
    }).populate({
      path: 'bill',
      populate: {
          path: 'shipProfile.ward',
      },
    }).exec()
    console.log(bills)
    const result = await Promise.all(bills.map(item=>item.bill))
    res.status(200).json({data:result.filter(item=>item)})
  }

  async getManageBills(req, res, next) {
    const bills = await ShipConfirm.find({user: req.user._id}).sort({date: -1}).populate({
      path: 'bill',
      populate: {
          path: 'shipProfile.province',
      },
    }).populate({
      path: 'bill',
      populate: {
          path: 'shipProfile.distric',
      },
    }).populate({
      path: 'bill',
      populate: {
          path: 'shipProfile.ward',
      },
    }).exec()
    const result = await Promise.all(bills.map(item=>item.bill))
    res.status(200).json({data:result.filter(item=>item)})
  }

  async checkOut(req, res, next) {
    const validate = validationResult(req);
    if (validate.errors.length) {
      let errors = validate.mapped();
      res.status(400).json({ errors });
    }else{
        const payload = req.body;
        const user = req.user;
        const cart = req.cookies.cart
        const result = await BillDAO.createBill(payload, user, cart)
        switch (result.code) {
          case 1:
            res.cookie('cart', [])
            res.status(200).json({ code: 200, data: result.data });
            break;
          case 0:
            res.status(404).json({ code: 404, message: result.message });
            break;
          case -1:
            res.status(500).json({ code: 500, message: result.message });
            break;
        }
    }
  }

  async getBills(req, res, next) {
    const data = await BillDAO.getBills()
    res.status(200).json(data)
  }

  async manageBills(req, res, next){
    const data = await BillDAO.getBills({state: 1, manageAssigned: false})
    res.status(200).json(data)
  }

  async shipBills(req, res, next) {
    const data = await BillDAO.getBills({state: 2, shipAssigned: false})
    console.log(data)
    res.status(200).json(data)
  }

  async confirmBill(req, res, next){
    const id = req.body.id
    if (id){
      const result = await BillDAO.confirmBill(id, req.user)
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, message: result.message });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }

  async billState(req, res, next) {
    const id = req.body.id
    const value = Number.parseInt(req.body.value)
    if (id && (value >= 0 && value <=5)){
      const check = await ShipConfirm.find({user: req.user._id, bill: id}).exec()
      if (check){
        const result = await BillDAO.updateState(id, value)
        switch (result.code) {
          case 1:
            res.status(200).json({ code: 200, message: result.message });
            break;
          case 0:
            res.status(404).json({ code: 404, message: result.message });
            break;
          case -1:
            res.status(500).json({ code: 500, message: result.message });
            break;
        }
      }else{
        res.status(401).json({code: 401, message: "Bạn không được thay đổi đơn này"}) 
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }

  async getProducts(req, res, next) {
    const result = await ProductDAO.getProductsList({}, {}, {}, {date: -1})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async billPayment(req, res, next){
    const id = req.body.id
    const value = Number.parseInt(req.body.value)
    if (id && (value === 0 || value === 1)){
      const check = await ShipConfirm.find({user: req.user._id, bill: id}).exec()
      if (check){
        const result = await BillDAO.updatePayment(id, value)
        switch (result.code) {
          case 1:
            res.status(200).json({ code: 200, message: result.message });
            break;
          case 0:
            res.status(404).json({ code: 404, message: result.message });
            break;
          case -1:
            res.status(500).json({ code: 500, message: result.message });
            break;
        }
      }else{
        res.status(401).json({code: 401, message: "Bạn không được thay đổi đơn này"}) 
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }
  
  async confirmDelivering(req, res, next){
    const id = req.body.id
    if (id){
      const result = await BillDAO.confirmDelivering(id, req.user)
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, message: result.message });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }

  async confirmSuccessDelivery(req, res, next){
    const id = req.body.id
    if (id){
      const result = await BillDAO.confirmDeliverySuccess(id, req.user)
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, message: result.message });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }

  async confirmFailDelivery(req, res, next){
    const id = req.body.id
    if (id){
      const result = await BillDAO.confirmDeliveryFail(id, req.user)
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, message: result.message });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }

  async confirmDelivery(req, res, next) {
    const id = req.body.id
    if (id){
      const result = await BillDAO.confirmDelivery(id, req.user)
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, message: result.message });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }

  async confirmManage(req, res, next) {
    const id = req.body.id
    if (id){
      const result = await BillDAO.confirmManage(id, req.user)
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, message: result.message });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }else{
      res.status(400).json({code: 400, message: "Đơn hàng không hợp lệ"}) 
    }
  }

  async getMinMaxPrice(req, res, next){
    const priceRange = await ProductDAO.getMinMaxPriceRange()
    res.status(200).json(priceRange) 
  }

  async search(req, res, next) {
    const option = parseSearch(req.query)
    const page = req.query.page
    const result = await ProductDAO.getProductsList(option, 20, 20*(page-1))
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }
  async getCart(req, res, next) {
    var cart = req.cookies.cart
    var parsedCart = await parseCart(cart)
    res.status(200).json(parsedCart)
  }

  async addCart(req, res, next) {
    const validate = validationResult(req);
    if (validate.errors.length) {
      let errors = validate.mapped();
      res.status(400).json({ errors });
    } else {
      const colorId = req.query.colorId;
      const productId = req.query.productId;
      const sizeId = req.query.sizeId;
      const quantity = Number.parseInt(req.query.quantity);
      var result = await ProductDAO.getSubProduct({ productId, colorId, sizeId });
      switch (result.code) {
        case 1:
          var cart = req.cookies.cart
          if (cart){
            cart = addCart(cart, {newProduct: result.data[0], quantity})
          }else{
            cart = [{
              subProdId: result.data[0]._id,
              quantity
            }]
          }
          res.cookie('cart', cart)
          var parsedCart = await parseCart(cart)
          res.status(200).json({ code: 200, data: result.data, parsedCart });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }
  }

  async removeCart(req, res, next){
    const id = req.query.id
    var cart = req.cookies.cart
    cart = removeCart(cart, id)
    res.cookie('cart', cart)
    res.status(200).json({code: 200})

  }

  async addProduct(req, res, next) {
    const validate = validationResult(req);
    if (validate.errors.length) {
      let errors = validate.mapped();
      res.status(400).json({ errors });
    } else {
      var payload = await getPayload(req);
      if (payload.code !== 1) {
        res.status(payload.code == 0 ? 400 : 500).json({
          errors: {
            images: {
              msg: payload.message,
              param: "images",
            },
          },
        });
      } else {
        var result = await ProductDAO.createNew(payload.data, { isNew: true });
        switch (result.code) {
          case 1:
            res.status(200).json({ code: 200, productId: result.data._id });
            break;
          case -1:
            res.status(500).json({ code: 500, message: result.message });
            break;
        }
      }
    }
  }
  async updateQuantity(req, res, next) {
    const id = req.body.id;
    const quantity = req.body.quantity;
    const result = await ProductDAO.updateSubProduct(id, {quantity})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async updateName(req, res, next){
    const id = req.body.id;
    const name = req.body.name;
    const result = await ProductDAO.updateProduct(id, {name})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async updatePrice(req, res, next){
    const id = req.body.id;
    const price = req.body.price;
    const result = await ProductDAO.updateProduct(id, {price})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async updateSale(req, res, next) {
    const id = req.body.id;
    const sale = req.body.sale;
    const isSale = req.body.isSale;
    const result = await ProductDAO.updateProduct(id, {sale, isSale})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async updateNew(req, res, next) {
    const id = req.body.id;
    const isNew = req.body.isNew;
    const result = await ProductDAO.updateProduct(id, {isNew})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async updateDesc(req, res, next) {
    const id = req.body.id;
    const desc = req.body.desc;
    const result = await ProductDAO.updateProduct(id, {desc})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async updateImages(req, res, next) {
    const id = req.body.id
    if (req.files.length > 10 || req.files.length < 5){
      res.status(400).json({ code: 400, message: "Vui lòng thêm ảnh từ 5 đến 10 ảnh" })
    }else{
      const product = await ProductDAO.findById(id)
      if (product.code === 1){
        var images = await updateFiles(req.files)
        const result = await ProductDAO.updateProduct(id, {images: images.data})
        switch (result.code) {
          case 1:
            res.status(200).json({ code: 200, data: result.data });
            break;
          case 0:
            res.status(404).json({ code: 404, message: result.message });
            break;
          case -1:
            res.status(500).json({ code: 500, message: result.message });
            break;
        }
      }else{
        res.status(404).json({ code: 404, message: "Không tìm thấy sản phẩm" });
      }
    }
  }
 
  async updateSub(req, res, next) {
    const id = req.body.id;
    const subList = req.body.subList
    const result = await ProductDAO.addUpdateAndDeleteSubProduct(id, subList)
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }

  }

  async removeProduct(req, res, next) {
    const id = req.body.id;
    const result = await ProductDAO.removeProduct(id)
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async filter(req, res, next) {
    const data = req.body
    const filterObj = parseFilter(data)
    const category = getData('category', data)
    const catList = category?(category.value.map(item => item._id)):undefined
    const result = await ProductDAO.advancedSearch(filterObj, catList ,{},{},{date: -1})
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async getImages(req, res, next) {
    const id = req.query.id
    const result = await ProductDAO.findById(id)
    switch (result.code) {
      case 1:
        res.status(200).json({ code: 200, data: result.data.images });
        break;
      case 0:
        res.status(404).json({ code: 404, message: result.message });
        break;
      case -1:
        res.status(500).json({ code: 500, message: result.message });
        break;
    }
  }

  async getSub(req, res, next) {
    const validate = validationResult(req);
    if (validate.errors.length) {
      let errors = validate.mapped();
      res.status(400).json({ errors });
    } else {
      const colorId = req.query.colorId;
      const productId = req.query.productId;
      const sizeId = req.query.sizeId;
      var result;
      if (sizeId) {
        result = await ProductDAO.getSubProduct({ productId, colorId, sizeId });
      } else {
        result = await ProductDAO.getSubProduct({ productId, colorId });
      }
      switch (result.code) {
        case 1:
          res.status(200).json({ code: 200, data: result.data });
          break;
        case 0:
          res.status(404).json({ code: 404, message: result.message });
          break;
        case -1:
          res.status(500).json({ code: 500, message: result.message });
          break;
      }
    }
  }

  async getAdress(req, res, next) {
    
  }

  async province(req, res, next){
    const provinces = await AddressDAO.getProvince()
    res.status(200).json({provinces})
  }

  async district(req, res, next) {
    const id = req.params.id;
    if (id){
      const districts = await AddressDAO.getDistrictByProvince(id)
      res.status(200).json({districts})
    }else{
      res.status(400).json({ code: 400, message: "Vui lòng nhập mã Tỉnh/ Thành" });
    }
  }

  async ward(req, res, next) {
    const id = req.params.id;
    if (id){
      const wards = await AddressDAO.getWardByDistrict(id)
      res.status(200).json({wards})
    }else{
      res.status(400).json({ code: 400, message: "Vui lòng nhập mã Tỉnh/ Thành" });
    }
  }
}

const getData = (property, data) => {
  for (var i of data){
    if (i.property === property){
      return i
    }
  }
}
module.exports = new APIController();
