
const ColorDAO = require('../repo/ColorDAO')
class ColorController{

    async getList(req,res,next){
        var result = await ColorDAO.getList();
        switch(result.code){
            case -1: 
                res.status(500).json({message: "Internal Exception"});
                break;
            case 1:
                res.status(200).json({data: result.data});
                break;
            default:
                res.status(404).json({message: "CC"});
        }
    }
}

module.exports = new ColorController;