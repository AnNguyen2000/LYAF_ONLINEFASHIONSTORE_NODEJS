const ProductDAO = require('../repo/ProductDAO')
const Product = require('../models/Product')
const SubProduct = require('../models/SubProduct')
const CategoryDAO = require('../repo/CategoryDAO')
const url = require('url');
const querystring = require('querystring');
const {parseSearch, parseSort, createPageRange} = require('../../helper/function')
class ClientController{
    async client(req,res,next){
        var result = await ProductDAO.getProductsList({isNew: true},10, {}, {date: -1})
        var sale = await ProductDAO.getProductsList({isSale: true},10, {}, {date: -1})
        switch(result.code){
            case 1:
                res.status(200).render('home', {user: req.user, data: result.data.map((_)=>_.toObject()), boss: req.params.boss, sale: sale.data.map((_)=>_.toObject()) });
                break;
            case -1:
                res.status(500).render('404', {user: req.user, boss: req.params.boss});
                break;
        }
    }

    async productDetail(req,res,next){
        var id = req.params.id
        var result = await ProductDAO.findById(id)
        switch(result.code){
            case 1:
                res.status(200).render('productDetail', {user: req.user, data: result.data, boss: req.params.boss});
                break;
            case 0:
                res.status(404).render('404', {user: req.user, boss: req.params.boss});
                break;
            case -1:
                res.status(500).render('404', {user: req.user, boss: req.params.boss});
                break;
        }
    }

    async productCollection(req,res,next){
        const numOfPro = 20
        const categories = await CategoryDAO.getList();
        const option = parseSearch(req.query)
        const page = req.query.page||1
        const sort = parseSort(req.query.sort)
        const numberOfDocs = await Product.countDocuments(option).exec()
        const pageRange = createPageRange(page, Math.ceil(numberOfDocs/numOfPro))
        const category = req.query.category==='any'?null:req.query.category
        const result = await ProductDAO.search(option, category, numOfPro, numOfPro*(page-1), sort)

        var query =  req.query
        delete query.page
        res.render('productCollection', {user: req.user,categories: categories.data, data: result.data, page, pageRange, option: req.query, search: new URLSearchParams(req.query).toString(), boss: req.params.boss});
    }

    search(req,res,next){
        Product.find({name: {$regex:new RegExp(req.body.keyword, "i")}}).exec()
        .then(data=>{
            data = data.map(data=>data.toObject());
            if(data.length > 0){
                res.status('200').json(data);
            }
            else{
                const isempty = {empty:'empty'}
                res.status('200').json(isempty);
            }
        })
    }
    notfound(req,res,next){
        res.render('404');
    }
}

module.exports = new ClientController;