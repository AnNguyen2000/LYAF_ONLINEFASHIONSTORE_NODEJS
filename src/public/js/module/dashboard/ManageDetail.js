$(document).ready(()=>{
    $(".confirm-manage").click(function(){
        const id = this.dataset.id
        console.log(id)
        showLoading()
        fetch(window.location.origin+'/api/manager/confirmManage',{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({id})
        })
        .then(data=>data.json())
        .then(data=>{
            if(data.code === 200){
                showToast("Nhận đơn", "Đơn hàng đã giao cho bạn")
                setTimeout(()=>{window.location.reload()}, 500)
            }else{
                showToast("Nhận đơn", data.message, "error")
            }
            hideLoading()
        }).catch(err=>{
            hideLoading()
            
            showToast("Nhận đơn ", err, "error")
        })
    })

    $(".confirm-state").click(function(){
        const id = this.dataset.id
        const value = $("#inputState").val()
        fetch(window.location.origin + '/api/manager/billState',{
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, value})
        }).then(data=> data.json())
        .then(data=>{
            if (data.code===200){
                showToast("Cập nhật tình trạng", data.message)
                setTimeout(()=>{window.location.reload()}, 500)
            }else{
                showToast("Cập nhật tình trạng", data.message, "error")
            }
        })
    })
    $(".confirm-payment").click(function(){
        const id = this.dataset.id
        const value = $("#payState").val()
        fetch(window.location.origin + '/api/manager/billPayment',{
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, value})
        }).then(data=> data.json())
        .then(data=>{
            if (data.code===200){
                showToast("Cập nhật thanh toán", data.message)
                setTimeout(()=>{window.location.reload()}, 500)
            }else{
                showToast("Cập nhật thanh toán", data.message, "error")
            }
        })
    })
})