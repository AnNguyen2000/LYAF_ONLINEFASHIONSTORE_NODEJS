$(document).ready(function(){
    showTable()
})


function showTable(){
    const columns = [
        {
          title: "Mã",
          data: "_id",
        },
        {
          title: "Ngày đặt",
          data: "date",
        },
        {
          title: "Tổng tiền",
          data: "totalPrice",
        },
        {
          title: "Tỉnh/thành",
          data: "province",
        },
        {
          title: "Quận/huyện",
          data: "district",
        },
        {
          title: "Phường/xã",
          data: "ward",
        },
        {
          title: "Tình trạng",
          data: "state",
        },
        {
          title: "",
          data: "detail",
        },
      ];
      
      showLoading()
      fetch(window.location.origin+'/api/getShipperBills')
      .then(data=>data.json())
      .then(data=>{
        console.log(data)
          var result = data.data
         var t = $("#aa-list").DataTable({
            responsive: true,
            data: parseData(result) ,
            columns,
            columnDefs: [{ orderable: false, targets: 0 }],
            "order": []
          });
          hideLoading()
      }).catch(err=>console.log(err))
}



function parseData(data) {
    const result = data.map(v=>{
      return {
        _id: v._id,
        date: new Date(v.date).toLocaleString("vi-VN"),
        totalPrice: (v.totalPrice*1000).toLocaleString('it-IT') +'<u>đ</u>',
        province: v.shipProfile.province.name,
        district: v.shipProfile.distric.name,
        ward: v.shipProfile.ward.name,
        state: billStatestate(v.state),
        detail: `<a href="/manager/bill/shipDetail/${v._id}">Chi tiết</a>`
      }
    })
    return result
  }
  function billStatestate(state){
    switch(state){// 0: Huỷ đơn hàng ,1: Đang chờ xử lý, 2: Đã xác nhận đơn hàng, 3: Đang vận chuyển, 4: Đã giao hàng
      case 0:
          return "Đã huỷ đơn hàng"
      case 1:
          return "Đang chờ xử lý"
      case 2:
          return "Đã xác nhận đơn"
      case 3:
          return "Đang vận chuyển"
      case 4:
          return "Giao hàng thành công"
      case 5:
          return "Giao hàng thất bại"
  }}