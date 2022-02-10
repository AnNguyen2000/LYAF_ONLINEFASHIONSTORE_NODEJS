$(document).ready(()=>{
    $(".confirm-delivery").click(function(){
        const id = this.dataset.id
        console.log(id)
        showLoading()
        fetch(window.location.origin+'/api/manager/confirmDelivery',{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({id})
        })
        .then(data=>data.json())
        .then(data=>{
            if(data.code === 200){
                showToast("Xác nhận giao hàng thành công", data.message)
                setTimeout(()=>{window.location.reload()}, 500)
            }else{
                showToast("Xác nhận giao hàng thành công", data.message, "error")
            }
            hideLoading()
        }).catch(err=>{
            hideLoading()
            
            showToast("Xác nhận vận chuyển ", err, "error")
        })
    })

    $(".confirm-delivering").click(function(){
        const id = this.dataset.id
        console.log(id)
        showLoading()
        fetch(window.location.origin+'/api/manager/confirmDelivering',{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({id})
        })
        .then(data=>data.json())
        .then(data=>{
            if(data.code === 200){
                showToast("Xác nhận đang giao hàng", data.message)
                setTimeout(()=>{window.location.reload()}, 500)
            }else{
                showToast("Xác nhận đang giao hàng", data.message, "error")
            }
            hideLoading()
        }).catch(err=>{
            hideLoading()
            
            showToast("Xác nhận đang giao hàng ", err, "error")
        })
    })

    $(".confirm-success").click(function(){
        const id = this.dataset.id
        console.log(id)
        showLoading()
        fetch(window.location.origin+'/api/manager/confirmSuccessDelivery',{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({id})
        })
        .then(data=>data.json())
        .then(data=>{
            if(data.code === 200){
                showToast("Xác nhận giao hàng thành công", data.message)
                setTimeout(()=>{window.location.reload()}, 500)
            }else{
                showToast("Xác nhận giao hàng thành công", data.message, "error")
            }
            hideLoading()
        }).catch(err=>{
            hideLoading()
            
            showToast("Xác nhận vận chuyển ", err, "error")
        })
    })

    $(".confirm-fail").click(function(){
        const id = this.dataset.id
        console.log(id)
        showLoading()
        fetch(window.location.origin+'/api/manager/confirmFailDelivery',{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({id})
        })
        .then(data=>data.json())
        .then(data=>{
            if(data.code === 200){
                showToast("Xác nhận giao hàng thất bại", data.message)
                setTimeout(()=>{window.location.reload()}, 500)
            }else{
                showToast("Xác nhận giao hàng thất bại", data.message, "error")
            }
            hideLoading()
        }).catch(err=>{
            hideLoading()
            
            showToast("Xác nhận vận chuyển ", err, "error")
        })
    })
})