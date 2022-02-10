const parseToElements = (obj) => {
    var username = obj._id;
    var name  = obj.name;
    var role ='';
 
    if(obj.role == 'admin'){
        role = 'admin';

    }
    else if(obj.role == 'NVVC'){
        role = 'Nhân viên vận chuyển';
    }
    else if(obj.role == 'NVDH'){
        role = 'Nhân viên đơn hàng';
    }
    else if(obj.role == 'NVSP'){
        role = 'Nhân viên sản phẩm';
    }
    else{
        role = 'User';
    }
    var email = obj.email||'None'
    var phone = obj.phoneNumber||'None'
    var action = `
      <div class="account-action">
        <a class="btn btn-primary" id="accDetailLink" href="/manager/accountDetail/${obj._id}">Detail</a> 
      </div>
    `
    return {
        username,
        name,
        phone,
        role,
        email,
        action
    };
  };
$(document).ready(()=>{
    fetch(window.location.origin+'/manager/accountManager',{method:'get'})
    .then(data=>data.json())
    .then(data=>{
      var accList = data.user.map(_ => {
        console.log(_)
        return parseToElements(_)
      })
      
    
  
      // DATATABLE
      if ($("#accTable")[0]) {
        var columns = [
          {
            title: "UserName",
            data: "username",
          },
          {
            title: "Name",
            data: "name",
          },
          {
            title: "Role",
            data: "role",
          },
          {
            title: "Phone",
            data: "phone",
          },
          {
            title: "Email",
            data: "email",
          },
          {
            title: "Action",
            data: "action",
          },
         
        ];
  
        var t = $("#accTable").DataTable({
          responsive: true,
          data: accList,
          columns,
          autoWidth:false,
          "order": []
        });
  
       
        }
      })
  })
//Event add Acc:
if( document.querySelector('#accAddBtn') != null){
  document.querySelector('#accAddBtn').addEventListener('click',function(){
    if(document.querySelector('#accadd-username').value =='' || document.querySelector('#accadd-role').value =='' ||document.querySelector('#accadd-name').value == '' || document.querySelector('#accadd-pass').value == '' || document.querySelector('#accadd-passcheck').value == ''){
      console.log('error');
      showToast('Cảnh báo !',' Input đang trống nè !','warning');
    }
    else{
      if(document.querySelector('#accadd-pass').value != document.querySelector('#accadd-passcheck').value){
        showToast('Lỗi !',' Xác nhận mật khẩu thất bại !','error');
      }
      else{
        const data = JSON.stringify({
          accName: document.querySelector('#accadd-name').value,
          accRole:document.querySelector('#accadd-role').value,
          accUserName: document.querySelector('#accadd-username').value,
          accPass: document.querySelector('#accadd-pass').value,
          accPassCheck: document.querySelector('#accadd-passcheck').value,
        })
        fetch(window.location.origin+'/manager/addaccount',{method:'post',body:data,headers: {
          'Content-Type': 'application/json'
      },})
          .then((data) => {
            if(data.status == 200){
              window.location.href="/manager/account";
              showToast('Thêm Tài khoản','Thêm thành công !');
            }
            else if(data.status == 400){
              showToast('Thêm Tài khoản','Thêm thất bại !','error');
            }
            else if(data.status == 500){
              showToast('Thêm Tài khoản','Thêm thất bại !','error');
            }
          })

      }
    }
  })
}
//Event Filter:
if(document.querySelector('#filterBtn') != null){
  document.querySelector('#filterBtn').addEventListener('click',function(){
    var filtervalue;
    const data = JSON.stringify({
      filtervalue: document.querySelector('#filterlist').value,
      filter: true,
      
    });
    fetch(window.location.origin+'/manager/filteraccount',{method:'post',body:data,headers: {
        'Content-Type': 'application/json'
    },})
    .then(data=>data.json())
    .then(data=>{
      console.log('data:', data);
      var accList = data.user.map(_ => {
        console.log(_)
        return parseToElements(_)
      })
      
    console.log('accList:',accList);
  
      // DATATABLE
      if ($("#accTable")[0]) {
        var columns = [
          {
            title: "UserName",
            data: "username",
          },
          {
            title: "Name",
            data: "name",
          },
          {
            title: "Role",
            data: "role",
          },
          {
            title: "Phone",
            data: "phone",
          },
          {
            title: "Email",
            data: "email",
          },
          {
            title: "Action",
            data: "action",
          },
         
        ];
        if(!accList.length){
          $('#accTable').dataTable().fnClearTable();
        }
        else{
          $('#accTable').dataTable().fnClearTable();
          $('#accTable').dataTable().fnAddData(accList);
        }
      
        }
      })
  })
}
 
//Event Account:
document.querySelector('#accDetailCancel').addEventListener('click',function(){
    window.location.href="/manager/account";
})
document.querySelector('#accDetailUpdate').addEventListener('click',function(){
      const data = JSON.stringify({
        accDetailID : document.querySelector('#acc-username').value,
        acDetailName : document.querySelector('#acc-name').value,
        accDetailRole: document.querySelector('#acc-role').value,
        accDetailPhone: document.querySelector('#acc-phone').value,
        accDetailEmail: document.querySelector('#acc-email').value,
      });
      fetch(window.location.origin+'/manager/updateaccount',{method:'post',body:data,headers: {
          'Content-Type': 'application/json'
      },})
          .then((data) => {
            if(data.status == 200){
              showToast('Cập nhật Tài Khoản','Cập nhật thành công !');
            }
            else if(data.status ==400){
              showToast('Cập nhật Tài khoản','Cập nhật thất bại !');
            }
            else if(data.status == 500){
              showToast('Cập nhật Tài khoản','Cập nhật thất bại !');
            }
          })
  
  });

  document.querySelector('#accDetailDelete').addEventListener('click',function(){
    const data = JSON.stringify({
      accDetailID : document.querySelector('#acc-username').value,
      
    });
    fetch(window.location.origin+'/manager/deleteaccount',{method:'post',body:data,headers: {
        'Content-Type': 'application/json'
    },})
        .then((data) => {
          if(data.status == 200){
            window.location.href = '/manager/account';
          }
          else if(data.status == 400){
            showToast('Cập nhật Tài khoản','Cập nhật thất bại !','error');
          }
          else if(data.status == 500){
            showToast('Cập nhật Tài khoản','Cập nhật thất bại !');
          }
        })

});

////Event Modal:
document.querySelector('accDetailAdd').addEventListener('click',function(){
  $(".property-confirm-modal .modal-title").html('Xoá màu sắc')
  $(".property-confirm-modal .modal-body").html(`Bạn có muốn xoá màu săc <b>OKOK</b>`)
  $(".property-confirm-modal .confirm").attr("data-property", "color")
  $(".property-confirm-modal .confirm").attr("data-id", 'OK LUÔN')
  $(".property-confirm-modal").modal("show")
})

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

