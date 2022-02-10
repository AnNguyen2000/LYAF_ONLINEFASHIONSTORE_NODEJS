const userModel = require('../models/User');
const accModel = require('../models/Account');
const ShipModel = require('../models/ShipProfile');
const BillDAO = require('../repo/BillDAO');
const bcrypt = require("bcrypt");
const { parseCart } = require("../../helper/function");
class userInfoController{

    start(req,res,next){
        console.log(req.params)
        userModel.findById(req.user._id).lean().exec()
        .then(user=> {
            if (user)
            res.render('userInformation',{user, boss: req.params.boss});
            else
            res.render('404');
        }).catch(err=>{
            res.render('404');
        })
    }
    async userInfoUpdate(req,res,next){
        await userModel.findByIdAndUpdate(req.user._id,{
            name: req.body.profilename,
            phoneNumber: req.body.profilephone,
            email:req.body.profilemail,
        }).exec()
        .then((data)=>{
            if (data){
                res.redirect('/userInfo');
            }else{
                res.render('404');
            }
        })
    }
    async proStatus(req,res,next){
        const userId = req.user._id
        const bills = await BillDAO.findBillById(userId)
        res.render('proStatus', {user: req.user, bills, boss: req.params.boss});
    }
    async proStatusDetail(req,res,next){
        const billId = req.params.id
        const userId = req.user._id
        const result = await BillDAO.getBillDetail({ user: userId, _id: billId})
        switch (result.code) {
            case 1:
                result.data.billDetail = await parseCart(result.data.billDetail)
                const parsedCart = result.data.billDetail
                const truePrice = parsedCart.reduce((x,y) => x + y.price*y.quantity, 0);
                const salePrice = truePrice - parsedCart.reduce((x,y) => x + y.salePrice*y.quantity, 0);
                const tempPrice = truePrice - salePrice
                const deliveryPrice = (tempPrice - salePrice) > 500 ? 0 : 50; 
                const totalPrice = tempPrice - salePrice + deliveryPrice
                res.render('proStatusDetail', {user: req.user, data: result.data, salePrice, deliveryPrice, tempPrice, totalPrice, boss: req.params.boss});
                break;
            case 0:
                res.render('404');
                break;
            case -1:
                res.render('404');
                break;
          }
    }
    async changePass(req,res,next){
    
            res.render('changePass',{error: req.params.error, user: req.user, boss: req.params.boss});
        
    }
    async changePassDone(req,res,next){
        var oldpass = req.body.oldpass;
        const newpass = req.body.newpass;
        const newpasscheck = req.body.newpasscheck;
        if(oldpass && newpass && newpasscheck){
            accModel.findOne({username : req.user._id}).exec()
            .then((data) =>{
                if(bcrypt.compareSync(oldpass, data.password)){
                    if(newpass == newpasscheck){
                        const bcryptpassword = bcrypt.hashSync(newpass, 10);
                        accModel.findByIdAndUpdate(data._id,{
                            password: bcryptpassword,
                        }).exec()
                        .then(()=>{
                            res.status(200).json();
                        })
                    }
                    else{
                         //Xác thưc mật khẩu mới thất bại !
                         const passerror = {error: 'Xác nhận mật khẩu mới thất bại !'};
                         res.status(300).json(passerror);
                    }
                }
                else{
                   
                    const passerror = {error: 'Mật khẩu cũ đã sai !'};
                    res.status(300).json(passerror);
                }
              
            })
        }
        else{
            res.send('opp !');
        }
    }

    addressList(req,res,next){
        ShipModel.find({user: req.user._id}).populate('province').populate('distric').populate('ward').exec()
                .then(data=>{
                    console.log('data start:',data);
                    data = data.map(data=>data.toObject());
                    res.render('AddressList',{data, user: req.user, boss: req.params.boss});
                })
                .catch(()=>{
                    console.log('500 shipmodel');
                    res.status(500).json();
                })
        
    }

     addressListAdd(req,res,next){
         console.log('addData:',req.body);
        const newship = new ShipModel({
            user: req.user._id,
            name:req.body.name,
            phone:req.body.phone,
            province: req.body.province,
            distric: req.body.district,
            ward:req.body.ward,
            address:req.body.stress,
        })
        newship.save()
        .then(ship=>{
            if(ship != null){
                ShipModel.find({user: req.user._id}).populate('province').populate('distric').populate('ward').exec()
                .then(data=>{
                    data = data.map(data=>data.toObject());
                    res.status(200).json(data);
                })
                .catch(()=>{
                    console.log('500 shipmodel');
                    res.status(500).json();
                })
            }
            else{
                console.log('400 shipmodel');
                res.status(400).json();
            }
        })
        .catch(()=>{
            console.log('500 newship');
            res.status(500).json();
        })
    }
    addressListDelete(req,res,next){

        ShipModel.findByIdAndDelete(req.body.id).exec()
        .then(data=>{
            if(data != null){
                ShipModel.find({user: req.user._id}).populate('province').populate('distric').populate('ward').exec()
                .then(data=>{
                    data = data.map(data=>data.toObject());
                    res.status(200).json(data);
                })
                .catch(()=>{
                    console.log('500 shipmodel');
                    res.status(500).json();
                })
            }
            else{
                console.log('400 delete');
                res.status(400).json();
            }
        })
        .catch(()=>{
            console.log('500 delete');
            res.status(500).json();
        })
    }
    addressListUpdateBefore(req,res,next){
        ShipModel.findById(req.body.id).populate('province').populate('distric').populate('ward').exec()
                .then(data=>{
                    if(data != null){
                        console.log('200 findOne');
                        res.status(200).json(data);
                    }
                    else{
                        console.log('400 findOne');
                        res.status(400).json(data);
                    }
                  
                })
                .catch(()=>{
                    console.log('500 findOne');
                    res.status(500).json(data);
                })
    }
    addressListUpdateAfter(req,res,next){
        console.log('data for update: ',req.body);
        console.log('id người dùng for update: ',req.user._id);
        ShipModel.findByIdAndUpdate(req.body.id,{
            user:req.user._id,
            name:req.body.name,
            phone:req.body.phone,
            province: req.body.province,
            distric: req.body.district,
            ward: req.body.ward,
            address: req.body.stress,

        }).exec()
        .then(updatedata=>{
            if(updatedata != null){
                ShipModel.find({user: req.user._id}).populate('province').populate('distric').populate('ward').exec()
                .then(data=>{
                    data = data.map(data=>data.toObject());
                    res.status(200).json(data);
                })
                .catch(()=>{
                    console.log('500 shipmodel');
                    res.status(500).json();
                })
            }
            else{
                console.log('400 updateData');
                res.status(400).json();
            }
        })
        .catch(()=>{
            console.log('500 updateData');
            res.status(500).json();
        })

    }
}

module.exports = new userInfoController;