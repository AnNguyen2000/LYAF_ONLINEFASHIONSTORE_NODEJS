$(document).ready(()=>{
    fetch(window.location.origin+'/api/province')
    .then(data=> data.json())
    .then(data=>{
        $(".delivery-form #province option").remove()
        const provinces = data.provinces
        $(".delivery-form #province").append(`<option selected>Chọn tỉnh/thành</option>`)
        provinces.forEach(_=> {
            $(".delivery-form #province").append(`<option value="${_._id}">${_.name}</option>`)
        })
    })
    $(".delivery-form #province").change(()=>{
        const provinceId = $(".delivery-form #province option:selected").val()
        if (provinceId){
            fetch(window.location.origin+'/api/district/'+provinceId)
            .then(data=> data.json())
            .then(data=>{
                $(".delivery-form #district option").remove()
                const districts = data.districts
                $(".delivery-form #district").append(`<option selected>Chọn quận/huyện</option>`)
                districts.forEach(_=> {
                    $(".delivery-form #district").append(`<option value="${_._id}">${_.name}</option>`)
                })
            })
        }
    })
    
    $(".delivery-form #district").change(()=>{
        const districtId = $(".delivery-form #district option:selected").val()
        if (districtId){
            fetch(window.location.origin+'/api/ward/'+districtId)
            .then(data=> data.json())
            .then(data=>{
                $(".delivery-form #ward option").remove()
                const wards = data.wards
                $(".delivery-form #ward").append(`<option selected>Chọn phường/xã</option>`)
                wards.forEach(_=> {
                    $(".delivery-form #ward").append(`<option value="${_._id}">${_.name}</option>`)
                })
            })
        }
    })
    $(".payment-option .radio-selection").change(function(){
        $(".payment-option .payment-desc").hide()
        $(this).parent().parent().find(".payment-desc").show()
    })

    $(".pick-a-profile").click(()=>{
        fetch(window.location.origin+'/checkout/showAddress',{method:'post'})
            .then((data) => {
                if(data.status == 200){
                    return data.json();
                }
                else{
                    showToast('Hiện thi Danh sách Địa chỉ','Hiện Thị Thất Bại !','error');
                }
            })
            .then(data=>{
                var profileList = '';
                console.log('data for address',data);
                for( let i of data){
                    var row = `<table class="forShowAddress">
                            <tr id="header" class="countName">
                                <td id="tempborder"></td>
                                <td class="icon-trash" style="display:flex; justify-content:flex-end" title="Click để chọn">
                                <div class="pushAddress" data-id="${i._id}">
                                    <i class="fas fa-address-book" ></i>
                                </div>
                                </td>
                            
                            </tr>
                            <tr>
                                <td><strong>Họ và tên</strong></td>
                                <td id="tdname">${i.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Địa chỉ</strong></td>
                                <td id="tdaddress">${i.address}</td>
                            </tr>
                            <tr>
                                <td><strong>Tỉnh / Thành</strong></td>
                                <td id="tdprovince">${i.province.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Quận / Huyện</strong></td>
                                <td id="tddistrict">${i.distric.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Phường / Xã</strong></td>
                                <td id="tdward">${i.ward.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Số điện thoại</strong></td>
                                <td id="tdphone">${i.phone}</td>
                            </tr>

                        </table>`;
                        profileList+=row;
                       
                }   
                console.log(document.querySelectorAll('.pushAddress'));
                document.querySelector('.showProfileHere').innerHTML = profileList;
                showToast('Hiện thi danh sách địa chỉ','Hiện Thị Thành Công !');
                $(".select-profile-modal").modal("show")
            })

        
    })

    $(".go-checkout").click((e)=>{
        e.preventDefault();

        const name = $('.checkout-form #name').val();
        const phone = $('.checkout-form #phone').val();
        const address = $('.checkout-form #address').val();
        const province = $('.checkout-form #province').val();
        const district = $('.checkout-form #district').val();
        const ward = $('.checkout-form #ward').val();
        const payment = $('.checkout-form input[name=payment]:checked').val();
        
        
        fetch(window.location.origin+'/api/checkout',{
            method: "POST",
            body: new URLSearchParams({name, phone, address, province, district, ward, payment})
        }).then(data=> data.json())
        .then(data=> {
            if (data.code===200){
                console.log(data)
                window.location.href = '/userInfo/proStatus/proStatusDetail/'+ data.data
            }else if (data.errors){
                const err = data.errors
                for (var prop in err) {
                    showToast(err[prop].param, err[prop].msg, "error")
                    break;
                }
            }else{
                showToast("Thanh toán", data.message , "error")
            }
        })
    })
 
})
$(document).ready(()=>{
    $(document).on('click', '.pushAddress', function(){
        console.log(this.dataset.id);
        const data = JSON.stringify({
            id: this.dataset.id,
        })
        fetch(window.location.origin+'/checkout/pushAddress',{method:'post',body:data,headers: {
            'Content-Type': 'application/json'
        }})
            .then((push) => {
                if(push.status == 200){
                    return push.json();
                }
                else{
                    showToast('Hiện thi Danh sách Địa chỉ','Hiện Thị Thất Bại !','error');
                }
            })
            .then(push=>{
                console.log(push);
                document.querySelector('.delivery-form #name').value = push.name;
                document.querySelector('.delivery-form #phone').value = push.phone;
                document.querySelector('.delivery-form #address').value = push.address;
                console.log(push)
                fetch(window.location.origin+'/api/province')
                        .then(data=> data.json())
                        .then(data=>{
                            // $(".delivery-form #province option").remove()
                            const provinces = data.provinces
                            $("#province").append(`<option id="firstselected" value="">Chọn tỉnh/thành</option>`)
                            provinces.forEach(_=> {
                                if(_._id == push.province._id){
                                    $("#province").append(`<option selected value="${_._id}">${_.name}</option>`)
                                }
                                else{
                                    $("province").append(`<option value="${_._id}">${_.name}</option>`)
                                }   
                               
                            })
                        })
                        const provinceId = push.province._id
                        // if (provinceId){
                            fetch(window.location.origin+'/api/district/'+provinceId)
                            .then(data=> data.json())
                            .then(data=>{
                                $("#district option").remove()
                                const districts = data.districts
                                $("#district").append(`<option value="">Chọn quận/huyện</option>`)
                                for (var _ of districts){

                                    if(_._id == push.distric._id){
                                        $("#district").append(`<option selected value="${_._id}">${_.name}</option>`)
                                    }
                                    else{
                                        $("#district").append(`<option value="${_._id}">${_.name}</option>`)
                                    }
                                }
                            }).catch(err=>{
                                console.log(err)
                            })
                            const districtId =  push.distric._id
                            // if (districtId){
                                fetch(window.location.origin+'/api/ward/'+districtId)
                                .then(data=> data.json())
                                .then(data=>{
                                    $("#ward option").remove()
                                    const wards = data.wards
                                    $("#ward").append(`<option value="">Chọn phường/xã</option>`)
                                    wards.forEach(_=> {
                                        if(_._id == push.ward._id){
                                            $("#ward").append(`<option selected value="${_._id}">${_.name}</option>`)
                                        }
                                        else{
                                            $("#ward").append(`<option value="${_._id}">${_.name}</option>`)
                                        }
                                       
                                    })
                                })
                $(".select-profile-modal").modal('hide')
            })
    })
})
// if(document.querySelectorAll('.pushAddress')){
//     console.log(document.querySelectorAll('.pushAddress'));
//     for(let i of document.querySelectorAll('.pushAddress')){
//         i.addEventListener('click',function(){
            
//         })
//     }
    
// }


