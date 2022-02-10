$(document).ready(()=>{
    $('.xzoom, .xzoom-gallery').xzoom({
        position: 'lens', 
        sourceClass: 'xzoom-hidden',
        defaultScale: -0.5,
    });

    $(document).on('click', ".LYAF-infor-detail #color #item", function(){
        if (!$(this).hasClass("selected")){
            $(".LYAF-infor-detail #color #item").removeClass("selected")
            $(this).addClass("selected")
        }
        const colorId = this.dataset.id
        const productId = this.dataset.productid
        showLoading()
        fetch(window.location.origin+'/api/product/getSub?'+ new URLSearchParams({productId, colorId}),{
            method: "GET",
        }).then(data=>data.json())
        .then(data=>{
            if (data.code===200){
                $(".LYAF-infor-detail #size #item").remove()
                $(".LYAF-infor-detail #stock span").remove()
                const subProduct = data.data
                subProduct.forEach(_ => {
                    $(".LYAF-infor-detail #size .warpper").append(`
                        <div id="item" data-id="${_.sizeId._id}" data-colorid="${_.colorId._id}" data-productid="${_.productId}"><span>${_.sizeId.name}</span></div>
                    `)
                })
            }else{
                showToast("Color", data.message, "error")
            }
            hideLoading()
        }).catch(err=>{showToast("Color", err, "error")
        hideLoading()})
    })

    $(document).on('click', ".LYAF-infor-detail #size #item", function(){
        const sizeId = this.dataset.id
        const colorId = this.dataset.colorid
        const productId = this.dataset.productid
        if (colorId){
            if (!$(this).hasClass("selected")){
                $(".LYAF-infor-detail #stock span").remove()
                $(".LYAF-infor-detail #size #item").removeClass("selected")
                $(this).addClass("selected")
            }
            showLoading()
            fetch(window.location.origin+'/api/product/getSub?'+ new URLSearchParams({productId, colorId, sizeId}),{
                method: "GET",
            }).then(data=>data.json())
            .then(data=>{
                if (data.code===200){
                    const subProduct = data.data[0]
                    $(".LYAF-infor-detail #quantity #value").attr("min", 0)
                    $(".LYAF-infor-detail #quantity #value").attr("max", subProduct.quantity)
                    $(".LYAF-infor-detail #stock").append(`<span>Còn lại <span id="number">${subProduct.quantity}</span> sản phẩm</span>`)
                }else{
                    showToast("Size", data.message, "error")
                }
                hideLoading()
            }).catch(err=>{
                showToast("Size", err, "error")
            hideLoading()})
        }else{
            showToast("Size", "Vui lòng chọn màu sắc trước", "warning")
        }
    })


    $(".LYAF-infor-detail #quantity .btn-minus").click(function(){
        var value =  Number.parseInt($(".LYAF-infor-detail #quantity #value").val())
        var min = Number.parseInt($(".LYAF-infor-detail #quantity #value").attr("min"))
        if (value>min)
        $(".LYAF-infor-detail #quantity #value").val(value-1)
    })

    $(".LYAF-infor-detail #quantity .btn-plus").click(function(){
        var value =  Number.parseInt($(".LYAF-infor-detail #quantity #value").val())
        var max =  Number.parseInt($(".LYAF-infor-detail #quantity #value").attr("max"))
        if (value<max)
        $(".LYAF-infor-detail #quantity #value").val(value+1)
    })


    $(".LYAF-order-section #add-cart button").click(function(){
        const selectedSize = $(".LYAF-infor-detail #size #item.selected")
        var min = Number.parseInt($(".LYAF-infor-detail #quantity #value").attr("min"))
        var max =  Number.parseInt($(".LYAF-infor-detail #quantity #value").attr("max"))
        const selectedColor = $(".LYAF-infor-detail #color #item.selected")
        const quantity = $(".LYAF-infor-detail #quantity input").val()
        if (selectedSize.length && selectedColor.length && quantity){
            const productId = this.dataset.productid
            const sizeId = selectedSize[0].dataset.id
            const colorId =  selectedColor[0].dataset.id
            var min = Number.parseInt($(".LYAF-infor-detail #quantity #value").attr("min"))
            var max =  Number.parseInt($(".LYAF-infor-detail #quantity #value").attr("max"))
            if (quantity > min && quantity < max) {
                showLoading()
                fetch(window.location.origin+'/api/addCart?'+ new URLSearchParams({productId, colorId, sizeId, quantity}),{
                    method: "GET",
                })
                .then(data=>data.json())
                .then(data=>{
                    if (data.code===200){
                        makeCart()
                        $(".LYAF-header .blur-bg").fadeIn(300)
                        $(".LYAF-header .LYAF-cart-box").css("right", "0")
                    }
                })
                hideLoading()
            }else{
                showToast("Quantity", "Số lượng không hợp lệ", "warning")
            }
        }else{
            showToast("Not select", "Vui lòng đầy đủ tính sản phẩm", "warning")
        }
    })

    
})

  