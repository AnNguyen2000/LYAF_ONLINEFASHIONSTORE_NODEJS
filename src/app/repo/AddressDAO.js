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

const Province = require('../models/Province')
const District = require('../models/District')
const Ward = require('../models/Ward')
module.exports = {
    getProvince: async () => {
        return Province.find().exec()
    },

    getDistrictByProvince: (provinceCode) => {
        return District.find({provinceCode}).exec()
    },

    getWardByDistrict: (districtCode) => {
        return Ward.find({districtCode}).exec()
    },
}