// QUY ĐỊNH TRẢ VỀ :
// LUÔN TRẢ VỀ ĐỊNH DẠNG JSON:
// {
//      code: 1,
//      message: "",
//      data: {},
// }
// QUY ĐỊNH property [code]:
// code = 1: Thành công
// code = -1: Lỗi
// code = 0: Không tìm thấy
// QUY ĐỊNH property [message]:
// message = "": Trả về thông báo về quá trình gọi data từ phương thức
// Ví dụ: Nếu không tìm thấY dữ liệU thì message = "Không tìm thấY"
// QUY ĐỊNH property [data]:
// data = {}: Trả về dữ liệu từ phương thức

const Category = require('../models/Category')

module.exports = {
    getList: async ()=>{
        return Category.find().lean().populate('parentId').exec()
        .then(data => {
            var parent = data.filter(_ => !(_.parentId))
            parent.sort((x,y) => x.name > y.name)
            var result = []
            parent.forEach(p => {
                result.push(p)
                data.forEach(_ => {
                    if (_.parentId && _.parentId._id === p._id){
                        result.push(_)
                    }
                })
            })
            return {
                code: 1,
                message: "Thấy dữ liệu thành công",
                data: result
            }
        })
        .catch(err=>{
            return {
                code: -1,
                message: err.errors
            }
        })
    },

    findById: async (id) => {
        return await Category.findById(id).exec();
    }
}