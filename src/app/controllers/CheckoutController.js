const { parseCart } = require("../../helper/function");
const ShipModel = require('../models/ShipProfile');
class userInfoController{

    async index(req,res,next){
        var cart = req.cookies.cart;
        if (cart.length){
            var parsedCart = await parseCart(cart);
            var truePrice = parsedCart.reduce((x,y) => x + y.price*y.quantity, 0);
            var salePrice = truePrice - parsedCart.reduce((x,y) => x + y.salePrice*y.quantity, 0);
            var tempPrice = truePrice - salePrice
            var deliveryPrice = (tempPrice - salePrice) > 500 ? 0 : 50; 
            var totalPrice = tempPrice - salePrice + deliveryPrice
            res.render('checkOut', {user: req.user, cart: parsedCart, tempPrice, salePrice, deliveryPrice, totalPrice, boss: req.params.boss});
        }else{
            res.render('404', {user: req.user, boss: req.params.boss});
        }
    }
    showAddress(req,res,next){
        console.log(req.user._id);
        ShipModel.find({user: req.user._id}).populate('province').populate('distric').populate('ward').exec()
        .then(data=>{
            console.log('show hồ sơ:',data);
            data = data.map(data=>data.toObject());
            res.status(200).json(data);
        })
    }
    pushAddress(req,res,next){
        console.log(req.user._id);
        ShipModel.findById(req.body.id).populate('province').populate('distric').populate('ward').exec()
        .then(data=>{
            console.log('show hồ sơ:',data);
            res.status(200).json(data);
        })
    }
}

module.exports = new userInfoController;