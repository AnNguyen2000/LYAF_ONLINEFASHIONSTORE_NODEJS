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

const Color = require('../models/Color')

module.exports = {
    getList: async ()=>{
        return Color.find().exec()
        .then(data => {
            return {
                code: 1,
                message: "Thấy dữ liệu thành công",
                data
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
        return Color.findById(id).exec();
    }
}