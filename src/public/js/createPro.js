const create_title = document.querySelector('.create_title');
const proSale_select = document.querySelector('#proSale__select');
const proSaleValueShow = document.querySelector('#proSaleValueShow');
const proSale_select_yes = document.querySelector('#yes');
const proSale_select_no = document.querySelector('#no');

// onload on body
const change =  ()  =>{
    var option = $("#proSale__select option:selected").attr("id")
    if (option === "no"){
        proSaleValueShow.classList.add('proSaleValueShow');
    }
    else{
        proSaleValueShow.classList.remove('proSaleValueShow');
    }
}