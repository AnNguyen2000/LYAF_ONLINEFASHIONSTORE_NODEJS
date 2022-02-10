const proModel = require('../models/Product');
const sizeModel = require('../models/Size');
const ProductDAO = require('../repo/ProductDAO')
const catModel = require('../models/Category');
const colorModel = require('../models/Color');
const BillDAO = require('../repo/BillDAO');
const userModel = require('../models/User')
const accModel = require('../models/Account')
const cloudinary = require('../../config/cloudinary');
const ShipConfirm = require('../models/ShipConfirm')
const {parseCart} = require('../../helper/function');
const bcrypt = require('bcrypt');
class ManagementController{

    proManager(req,res,next){
        res.redirect('/manager/me')
    }

    create(req,res,next){
        res.render('proManager', {route: "add", header: false});
    }
    
    list(req, res, next){
        res.render('proManager', {route: "list", header: false});
    }
    ship(req, res, next) {
        res.render('proManager', {route: "ship", header: false});
    }
    manage(req, res, next){
        res.render('proManager', {route: "manage", header: false});
    }
    bill(req, res, next){
        res.render('proManager', {route: "bill", header: false});
    }

    async me(req, res, next) {
        if (req.user.role === 'NVDH')
        res.render('ManageProfile', {user: req.user});
        if (req.user.role === 'NVVC')
        res.render('ShipperProfile', {user: req.user});
        if (req.user.role === 'NVSP')
        res.redirect('/manager/list')
        if (req.user.role === 'admin')
        res.redirect('/manager/account')
    }

    async manageDetail(req, res, next){
        const billId = req.params.id    
        const result = await BillDAO.getBillDetail({_id: billId})
        switch (result.code) {
            case 1:
                if (result.data.manageAssigned){
                    const check = await ShipConfirm.find({user: req.user._id, bill: billId}).exec()
                    if (!check){
                        res.render('404');
                    }
                }
                result.data.billDetail = await parseCart(result.data.billDetail)
                const parsedCart = result.data.billDetail
                const truePrice = parsedCart.reduce((x,y) => x + y.price*y.quantity, 0);
                const salePrice = truePrice - parsedCart.reduce((x,y) => x + y.salePrice*y.quantity, 0);
                const tempPrice = truePrice - salePrice
                const deliveryPrice = (tempPrice - salePrice) > 500 ? 0 : 50; 
                const totalPrice = tempPrice - salePrice + deliveryPrice
                res.render('manageBillDetail', {user: req.user, data: result.data, salePrice, deliveryPrice, tempPrice, totalPrice});
                break;
            case 0:
                res.render('404');
                break;
            case -1:
                res.render('404');
                break;
        }
    }

    async shipDetail(req, res, next){
        const billId = req.params.id   
        const result = await BillDAO.getBillDetail({_id: billId})
        switch (result.code) {
            case 1:
                if (result.data.shipAssigned){
                    const check = await ShipConfirm.find({user: req.user._id, bill: billId}).exec()
                    if (!check){
                        res.render('404');
                    }
                }
                result.data.billDetail = await parseCart(result.data.billDetail)
                const parsedCart = result.data.billDetail
                const truePrice = parsedCart.reduce((x,y) => x + y.price*y.quantity, 0);
                const salePrice = truePrice - parsedCart.reduce((x,y) => x + y.salePrice*y.quantity, 0);
                const tempPrice = truePrice - salePrice
                const deliveryPrice = (tempPrice - salePrice) > 500 ? 0 : 50; 
                const totalPrice = tempPrice - salePrice + deliveryPrice
                res.render('shipBillDetail', {user: req.user, data: result.data, salePrice, deliveryPrice, tempPrice, totalPrice});
                break;
            case 0:
                res.render('404');
                break;
            case -1:
                res.render('404');
                break;
        }
    }

    property(req, res, next){
        sizeModel.find({})
        .then((sizeList)=>{
            sizeList = sizeList.map((sizeList) => sizeList.toObject());
            catModel.find({}).populate('parentId')
            .then((catList)=>{
                catList = catList.map((catList) => catList.toObject());
                colorModel.find({})
                    .then((colorList)=>{
                        colorList = colorList.map((colorList) => colorList.toObject());
                        res.render('property', {sizeList,colorList,catList});
                    })
              
            })
        })

        
       
    }
    sizeManager(req,res,next){
        sizeModel.findById(req.body.sizeId).lean().exec()
        .then(
            (data)=>{
                res.status(200).json(data);
            }
        )
    }    
    async billDetail(req, res, next) {
        const billId = req.params.id
        const result = await BillDAO.getBillDetail({_id: billId})
        switch (result.code) {
            case 1:
                result.data.billDetail = await parseCart(result.data.billDetail)
                const parsedCart = result.data.billDetail
                const truePrice = parsedCart.reduce((x,y) => x + y.price*y.quantity, 0);
                const salePrice = truePrice - parsedCart.reduce((x,y) => x + y.salePrice*y.quantity, 0);
                const tempPrice = truePrice - salePrice
                const deliveryPrice = (tempPrice - salePrice) > 500 ? 0 : 50; 
                const totalPrice = tempPrice - salePrice + deliveryPrice
                res.render('billDetail', {route: "billDetail", header: false, user: req.user, data: result.data, salePrice, deliveryPrice, tempPrice, totalPrice});
                break;
            case 0:
                res.render('404');
                break;
            case -1:
                res.render('404');
                break;
          }
    }
    addsize(req,res,next){
        sizeModel.findById(req.body.addSizeID).lean().exec()
        .then((data)=>{
            if(data == null){
                const newsize = new sizeModel({
                    _id:req.body.addSizeID,
                    name:req.body.addSizeName,
                    desc:req.body.addSizeDesc,
                });
                newsize.save()
                .then(()=>{
                    sizeModel.find({})
                    .then((data)=>{
                        data = data.map(data=>data.toObject());
                        res.status(200).json(data);
                    })
                   
                })
                .catch(()=>{
                    res.status(300).json();
                })
            }
            else{
                res.status(400).json();
            }
        })
        .catch(()=>{
            res.status(500).json()
        })
    } 
    updatesize(req,res,next){

        sizeModel.findByIdAndUpdate(req.body.addSizeID,{
            name:req.body.addSizeName,
            desc:req.body.addSizeDesc,
        }).exec()
        .then((data)=>{
            if(data != null){
                sizeModel.find({})
                .then((data)=>{
                    data = data.map(data=>data.toObject());
                    res.status(200).json(data);
                })
            }
            else{
                res.status(400).json();
            }
        })
        .catch(()=>{
            res.status(500).json();
        })
    }   
    deletesize(req,res,next){
        sizeModel.findByIdAndDelete(req.body.addSizeID).exec()
        .then((data)=>{
            if(data !=null){
                sizeModel.find({})
                .then((data)=>{
                    data = data.map(data=>data.toObject());
                    res.status(200).json(data);
                })
            }
            else{
                res.status(400).json();
            }
        })
        .catch(()=>{
            res.status(500).json();
        })
    }
    async detail(req, res, next) {
        const billId = req.params.id
        const result = await BillDAO.getBillDetail({_id: billId})
        switch (result.code) {
            case 1:
                result.data.billDetail = await parseCart(result.data.billDetail)
                const parsedCart = result.data.billDetail
                const truePrice = parsedCart.reduce((x,y) => x + y.price*y.quantity, 0);
                const salePrice = truePrice - parsedCart.reduce((x,y) => x + y.salePrice*y.quantity, 0);
                const tempPrice = truePrice - salePrice
                const deliveryPrice = (tempPrice - salePrice) > 500 ? 0 : 50; 
                const totalPrice = tempPrice - salePrice + deliveryPrice
                res.render('billDetail', {route: "billDetail", header: false, user: req.user, data: result.data, salePrice, deliveryPrice, tempPrice, totalPrice});
                break;
            case 0:
                res.render('404');
                break;
            case -1:
                res.render('404');
                break;
          }
    }

    async productDetail(req, res, next) {
        const id = req.params.id
        if (id){
            const result = await ProductDAO.findById(id)
            switch (result.code) {
                case 1:
                    res.render('ManagerProductDetail', {data: result.data});
                    break;
                case 0:
                    res.render('404');
                    break;
                case -1:
                    res.render('404');
                    break;
              }
        }else{

        }
    }
    categoryParent(req,res,next){
        catModel.find({}).populate('parentId')
        .then(data=>{
            data = data.map((data)=>data.toObject());
            return res.status(200).json(data);
        })
    }
    categoryManager(req,res,next){
        catModel.findById(req.body.CatId).lean().exec()
        .then(
            (data)=>{
                res.status(200).json(data);
            }
        )
    }
    addcategory(req,res,next){
        catModel.findById(req.body.addCatID).lean().exec()
        .then((data)=>{
            if(data == null){
                const newcat = new catModel({
                    _id:req.body.addCatID,
                    name:req.body.addCatName,
                    parentId:req.body.addCatParent,
                });
                newcat.save()
                .then(()=>{
                    catModel.find({}).populate('parentId')
                    .then((data)=>{
                        data = data.map(data=>data.toObject());
                        res.status(200).json(data);
                    })
                })
                .catch(()=>{
                    res.status(300).json();
                })
            }
            else{
                res.status(400).json();
            }
        })
        .catch(()=>{
            res.status(500).json()
        })
    }
    deletecategory(req,res,next){
        catModel.findByIdAndDelete(req.body.addCatID).exec()
        .then((data)=>{
            if(data !=null){
                catModel.find({}).populate('parentId')
                        .then((data)=>{
                            data = data.map(data=>data.toObject());
                            res.status(200).json(data);
                        })
            }
            else{
                res.status(400).json();
            }
        })
        .catch((err)=>{
            res.status(500).json();
           
        })
        
    }
    updatecategory(req,res,next){
        if(req.body.addCatParent !=''){
            catModel.findByIdAndUpdate(req.body.addCatID,{
                name:req.body.addCatName,
                parentId:req.body.addCatParent,
            }).exec()
            .then((data)=>{
                if(data != null){
                    catModel.find({}).populate('parentId')
                        .then((data)=>{
                            data = data.map(data=>data.toObject());
                            res.status(200).json(data);
                        })
                }
                else{
                    res.status(400).json();
                }
            })
            .catch(()=>{
                res.status(500).json();
            })
        }
        else{
            catModel.findByIdAndUpdate(req.body.addCatID,{
                name:req.body.addCatName,
                parentId:req.body.addCatParent,
            }).exec()
            .then((data)=>{
                if(data != null){
                    catModel.find({}).populate('parentId')
                        .then((data)=>{
                            data = data.map(data=>data.toObject());
                            res.status(200).json(data);
                        })
                }
                else{
                    res.status(400).json();
                }
            })
            .catch(()=>{
                res.status(500).json();
            })
        }
        
    }
    colorManager(req,res,next){
        colorModel.findById(req.body.addColorID).lean().exec()
        .then(
            (data)=>{
                res.status(200).json(data);
            }
        )
    }
    async addcolor(req,res,next){
        var file = req.file;
        var upload = await cloudinary.uploads(file.path,'color');
        colorModel.findById(req.body.colorId).exec()
        .then((data)=>{
            if(data != null){
                res.status(400).json();
            }
            else{
                const newcolor = new colorModel({
                    _id:req.body.colorId,
                    name: req.body.colorName,
                    thumbnail:upload.url,
                })
                newcolor.save()
                .then((data)=>{
                    if(data !=null){
                        colorModel.find({})
                        .then((data)=>{
                            data = data.map(data=>data.toObject());
                            res.status(200).json(data);
                        })
                    }
                    else{
                        rss.status(400).json();
                    }
                   
                })
                .catch(()=>{
                    res.status(500).json();
                })
            }
        })
        .catch(()=>{
            res.status(500).json();
        })
    }
    deletecolor(req,res,next){
        colorModel.findByIdAndDelete(req.body.colorId).exec()
        .then((data)=>{
            if(data !=null){
                colorModel.find({})
                .then((data)=>{
                    data = data.map(data=>data.toObject());
                    res.status(200).json(data);
                })
            }
            else{
                res.status(400).json();
            }
        })
        .catch(()=>{
            res.status(500).json();
        });
    }
    async updatecolor(req,res,next){
        var upload = await cloudinary.uploads(req.file.path,'color');
        colorModel.findByIdAndUpdate(req.body.colorId,{
            name:req.body.colorName,
            thumbnail:upload.url,
        })
        .exec()
        .then((data) =>{
            if(data !=null){
                colorModel.find({})
                .then((data)=>{
                    data = data.map(data=>data.toObject());
                    res.status(200).json(data);
                })
            }
            else{
                res.status(400).json();
            }
        })
        .catch(() =>{
            res.status(500).json();
        })
    }
    account(req,res,next){
       res.render('accountManager');
    }
    accManager(req,res,next){
       
        userModel.find({})
        .then(user=>{
            user = user.map(user=>user.toObject())
            res.status(200).json({user});
        })
    }
    accDetail(req,res,next){
        const id = req.params.id;
        userModel.findById(id).lean().exec()
        .then(data=>{
          
            res.render('accDetail',{data});
        })
       
    }
    addacc(req,res,next){
        console.log(req.body);
        accModel.findOne({username : req.body.accUserName}).exec()
        .then(acc=>{
            if(acc != null){
                console.log('400 acc');
                res.status(400).json();
            }
            else{
                const bcryptpassword = bcrypt.hashSync(req.body.accPass, 10);
                const newacc = new accModel({
                    username: req.body.accUserName,
                    password: bcryptpassword,
                })
                newacc.save()
                .then(newacc=>{
                    if(newacc != null){
                        const newuser = new userModel({
                            _id:req.body.accUserName,
                            name: req.body.accName,
                            role: req.body.accRole,
                        })
                        newuser.save()
                        .then(newuser=>{
                            if(newuser != null){
                                console.log('200 new user');
                                res.status(200).json();
                            }
                            else{
                                console.log('400 newuser');
                                res.status(400).json();
                            }
                        })
                        .catch(()=>{
                            console.log('500 newuser ');
                            res.status(500).json();
                        })
                    }
                    else{
                        console.log('400 newacc');
                        res.status(400).json();
                    }
                })
                .catch(()=>{
                    console.log('500 newacc');
                    res.status(500).json();
                })
            }
            
        })
        .catch(()=>{
            console.log('500 acc');
            res.status(500).json();
        })
    }
    deleteacc(req,res,next){
        console.log('user id',req.body.accDetailID);
        userModel.findByIdAndDelete(req.body.accDetailID).exec()
        .then(data=>{
            if(data != null){
                accModel.findOneAndDelete({username :req.body.accDetailID}).exec()
                .then(acc=>{
                    if(acc != null){
                        console.log('200 acc');
                        res.status(200).json();
                    }
                    else{
                        console.log('400 acc');
                        res.status(400).json();
                    }
                 
                })
                .catch(()=>{
                    console.log('500 acc');
                    res.status(500).json();
                })
                
            }
            else{
                console.log('400 data');
                res.status(400).json();
            }
        })
        .catch(()=>{
            console.log('500 data');
            res.status(500).json();
        })
    }
    updateacc(req,res,next){
        userModel.findByIdAndUpdate(req.body.accDetailID,{
            _id: req.body.accDetailID,
            name:req.body.accDetailName,
            role:req.body.accDetailRole,
            email:req.body.accDetailEmail,
            phoneNumber:req.body.accDetailPhone,

        }).exec()
        .then(data=>{
            if(data != null){
                res.status(200).json();
            }
            else{
                res.status(400).json();
            }
        })
        .catch(()=>{
            res.status(500).json();
        })
    }
    filteracc(req,res,next){
       if(req.body.filtervalue == 'all'){
        userModel.find({})
        .then(user=>{
            user = user.map(user=>user.toObject())
            res.status(200).json({user});
        })
       }
       else{
        userModel.find({role: req.body.filtervalue})
        .then(user=>{
            user = user.map(user=>user.toObject())
            res.status(200).json({user});
        })
        }
    }
       
}

// AB dsaasd
module.exports = new ManagementController;