
const cloudinary = require('../../config/cloudinary')
const path = require('path')
const ProductDAO = require('../../app/repo/ProductDAO')
const fs = require('fs');

exports.getPayload = async (req) => {
  var files =  req.files
  if (files.length < 5 || files.length > 10){
      return {code: 0, message: "Vui lòng cung cấp nhiều hơn 5 và ít hơn 10 ảnh"}
  }
  var isGood = true
  var images = await Promise.all(files.map(async (f)=>{
    var result = await cloudinary.uploads(f.path, "product")
    if (fs.existsSync(path.join(__dirname, "../../uploads/"+f.filename)))
    fs.unlinkSync(path.join(__dirname, "../../uploads/"+f.filename))
    if (result.code === 0){
      isGood = false
    }else{
      var url = cloudinary.url(result.public_id+'.jpg', {aspect_ratio: "1", background: "auto", crop: "pad"})
      return url
    }
  }))
  var subProduct = Array.isArray(req.body.subProduct)?(await Promise.all(req.body.subProduct.map(s => JSON.parse(s)))):[JSON.parse(req.body.subProduct)]
  if (isGood){
    return {code: 1, data: {...req.body, subProduct, images}}
  }else{
    return {code: -1, message: "Đã có lỗi khi tạo sản phẩm. Vui lòng thử lại"}
  }
}

exports.updateFiles = async (files)=>{
  var isGood = true
  var images = await Promise.all(files.map(async (f)=>{
    var result = await cloudinary.uploads(f.path, "product")
    if (fs.existsSync(path.join(__dirname, "../../uploads/"+f.filename)))
    fs.unlinkSync(path.join(__dirname, "../../uploads/"+f.filename))
    if (result.code === 0){
      isGood = false
    }else{
      var url = cloudinary.url(result.public_id+'.jpg', {aspect_ratio: "1", background: "auto", crop: "pad"})
      return url
    }
  }))
  if (isGood){
    files.forEach(async _=>{
      await cloudinary.remove('product/'+_.originalname.replace(".jpg",""))
    })
    return {code: 1, data: images}
  }else{
    return {code: -1, message: "Đã có lỗi khi tạo sản phẩm. Vui lòng thử lại"}
  }
}
exports.addCart = (cart, {newProduct, quantity}) => {
  if (newProduct){
    var flag = false
    cart.forEach((v,i)=>{
      if (v.subProdId === newProduct._id){
        flag = true
        cart[i].quantity += quantity
      }
    })

    if(!flag){
      cart.push({
        subProdId: newProduct._id,
        quantity
      })
    }
  }
  return cart
}

exports.parseCart = async (cart) => {
  if(cart && cart.length){
    var myCart = await Promise.all(cart.map(async (c) =>{
      try{
        var subProduct = await ProductDAO.getSubProductById(c.subProdId)
        var returnSubProduct = {
          subProdId: subProduct._id,
          productId: subProduct.productId._id,
          thumbnail: subProduct.productId.images[0],
          name: subProduct.productId.name,
          price: subProduct.productId.price,
          totalPrice: (subProduct.productId.price-(subProduct.productId.price * subProduct.productId.sale||0))*c.quantity,
          color: subProduct.colorId,
          size: subProduct.sizeId,
          isSale: subProduct.productId.isSale,
          salePrice: subProduct.productId.price-(subProduct.productId.price * subProduct.productId.sale||0),
          sale: subProduct.productId.sale,
          quantity: c.quantity
        }
        return returnSubProduct
      }catch{
        return null
      }
    }))
    return myCart.filter(n => n)
  }
  return []
  
}

exports.removeCart = (cart, id) => {
  console.log(cart, id)
  return cart.filter(_=>_.subProdId!==id)
}

exports.randomString = () => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  const n = 15
  for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

exports.parseSearch = (payload) => {
  const isNew = payload.isNew==='true'?true:undefined
  const isSale = payload.isSale==='true'?true:undefined
  const name = payload.keyword?{$regex:new RegExp(payload.keyword, "i")}:undefined
  const priceFrom = payload.priceFrom?Number.parseInt(payload.priceFrom):undefined
  const priceTo = payload.priceTo?Number.parseInt(payload.priceTo):undefined
  const price = priceTo&&priceTo?{
    $gte: priceFrom,
    $lte: priceTo
  }:undefined
  const ratingTo = payload.rating?Number.parseInt(payload.rating):undefined
  
  const rating = payload.ratingAll==='true'?undefined:ratingTo?{
    $gte: ratingTo-1,
    $lte: ratingTo
  }:undefined
  var search = {isNew, isSale, name, price, rating}
  Object.keys(search).forEach(key => search[key] === undefined && delete search[key])
  return search
}
const range= (size, startAt) => {
  return [...Array(size).keys()].map(i => i + startAt);
}
exports.createPageRange=(curPage, maxPage)=>{
    var pageRange = range(5, curPage-2)
    var start = pageRange.indexOf(1)
    var end = pageRange.indexOf(maxPage)
    if (start === -1 && end === -1){
        return pageRange
    }else if (start === -1){
        return pageRange.slice(0,end+1)
    }else if (end === -1){
        return pageRange.slice(start,)
    }else{
        return pageRange.slice(start, end+1)
    }
}
exports.parseSort = (sort) => {
  switch(sort){
    case 'any':
      return {}
    case 'price-desc':
      return {price: -1}
    case 'price-asc':
      return {price: 1}
    case 'rating-desc':
      return {rating: -1}
    case 'rating-asc':
      return {rating: 1}
    case 'name-az':
      return {name: -1}
    case 'name-za':
      return {name: 1}
    default:
      return undefined
  }
}

exports.parseFilter = (payload) => {
  var filter = {
    date: parseProperty(getData('date', payload)),
    price: parseProperty(getData('price', payload)),
    id: parseProperty(getData('id', payload)),
    name: parseProperty(getData('name', payload)),
    rating: parseProperty(getData('rate', payload))
  }
  Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key])
  
  return filter
}

const getData = (property, data) => {
  for (var i of data){
    if (i.property === property){
      return i
    }
  }
}

const parseProperty = (data) => {
  if (data){

    switch(data.property){
      case "date":
        const value = data.value
        const start = new Date(value.start)
        const end = new Date(value.start)
        end.setDate(end.getDate() + 1)
        return {$gte:start.toISOString() ,$lt:end.toISOString()}
      case "id":
        return {$regex:new RegExp(data.value, "i")}
      case "name":
        return {$regex:new RegExp(data.value, "i")}
      case "price":
        switch(data.action){
          case "less":
            return {$lte: Number(data.value)}
          case "greater":
            return {$gte: Number(data.value)}
          case "equal":
            return Number(data.value)
          case "between":
            return {
              $gte: Number(data.value.from),
              $lte: Number(data.value.to)
            }
        }
      case "rate":
        switch(data.action){
          case "less":
            return {
                $lte: Number(data.value)
            }
          case "greater":
            return {
                $gte: Number(data.value)
            }
          case "equal":
            return Number(data.value)
          case "between":
            return {
              $gte: Number(data.value.from),
              $lte: Number(data.value.to)
            }
        }
      case "category":
        const catValue = data.value.map(item => item._id)
        return { categoryId: { $in: catValue }, 'categoryId.parentId': { $in: catValue }}
    }
  }
}