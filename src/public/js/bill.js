$(document).ready(()=>{
    $(".proStatus-detail").click(function (){
        const billId = this.dataset.id;
        
        if (billId){
            window.location.href = window.location.origin + '/userInfo/proStatus/proStatusDetail/' + billId
        }
    })
})