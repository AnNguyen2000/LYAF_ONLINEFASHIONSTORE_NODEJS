import {Filter} from "../Filter.js"


var G_currentInput = {
    name: "",
    desc: "",
    price: null,
    category: null,
    productID: null,
    color: null,
    size: null,
    images: null,
    thumbnails: null,
  };
  
  const parseToElements = (obj) => {
    var productDetail = `<div id="list-product-detail">
                          <img id="list-product-thumbail" src='${
                            obj.images[0]
                          }'>
                          <div id="list-product-info">
                              <span id="list-product-name">${obj.name}</span>
                              <span id="list-new">${obj.isNew?'<b>New</b>':''} ${obj.isSale?'<b>Sale</b>':''}</span>
                          </div>
                        </div>`;
    var id = obj._id;
    var categories = (obj.categoryId.parentId?(obj.categoryId.parentId.name + ', '):'') + obj.categoryId.name
    var price = (obj.price*1000).toLocaleString('it-IT') + "<u>đ</u>";
    var date = new Date(obj.date).toLocaleString('vi-VN')
    var rateStar = [];
    for (var i = 0; i < 5; i++) {
      if (obj.rating - i >= 1) {
        rateStar.push('<span><i class="fas fa-star"></i></span>');
      } else if (obj.rating - i > 0 && obj.rating - i < 1) {
        rateStar.push('<span><i class="fas fa-star-half-alt"></i></span>');
      } else {
        rateStar.push('<span><i class="far fa-star"></i></span>');
      }
    }
    var rate = ` <div id='list-product-rating'>
                  <div id="rating-star">
                    ${rateStar.map((_) => _).join(" ")}
                  </div>
                  <div id="rating-value">
                    <span>${obj.rating}/5</span>
                  </div>
                </div>`;
    var action = ` <div id="list-product-action">
                    <div class="btn-group dropup">
                      <button type="button" class="btn btn-outline-secondary">
                        <a href="/manager/list/detail/${obj._id}">Detail</a>
                      </button>
                      <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Remove</a>
                        <a class="dropdown-item" href="#">Edit</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Separated link</a>
                      </div>
                    </div>
                  </div>`;
    return {
      productDetail,
      id,
      categories,
      price,
      date,
      rate,
      action,
    };
  };
  
  

$(document).ready(()=>{
  fetch(window.location.origin+'/api/manager/getProducts')
  .then(data=>data.json())
  .then(data=>{
    var productList = data.data.map(_ => {
      return parseToElements(_)
    })
    getSetupList().then(data=>{
      const colorList = data.colors.data
      const sizeList = data.sizes.data
      const categoryList = data.categories.data
      var filters = new Filter("aaaa",{
        data:[{
            property: "id",
            title: "ID",
            type: "text"
        },{
            property: "name",
            title: "Name",
            type: "text"
        },{
            property: "price",
            title: "Price",
            type: "number"
        },{
            property: "category",
            title: "Category",
            type: "category"
        },{
            property: "rate",
            title: "Rate",
            type: "number"
        },{
          property: "date",
          title: "Date",
          type: "date"
      }],
        submit: function() {
          const tags = this.tags
          showLoading()
          fetch(window.location.origin+"/api/product/filter",{
            method: "POST",
            headers: {
              'content-type': 'application/json',
              
            },
            body: JSON.stringify(tags)
          })
          .then(data=>data.json())
          .then(data=> {
            var productList = data.data.map(_ => {
              return parseToElements(_)
            })
            $('#LYAF-list').dataTable().fnClearTable();
            if (productList.length)
            $('#LYAF-list').dataTable().fnAddData(productList);
              hideLoading()
          })
        }, sizeList, colorList, categoryList})
    })
  

    // DATATABLE
    if ($("#LYAF-list")[0]) {
      var columns = [
        {
          title: "Chi tiết",
          data: "productDetail",
        },
        {
          title: "Ngày tạo",
          data: "date",
        },
        {
          title: "ID",
          data: "id",
        },
        {
          title: "Danh mục",
          data: "categories",
        },
        {
          title: "Giá",
          data: "price",
        },
        {
          title: "Rating",
          data: "rate",
        },
        {
          title: "",
          data: "action",
        },
      ];

      var t = $("#LYAF-list").DataTable({
        responsive: true,
        data: productList,
        columns,
        "order": []
      });

      $("#LYAF-list #list-product-color").hover(
        function (e) {
          if (!$(".LYAF-popup-info").is(":visible")) {
            $(".LYAF-popup-info").append(`<img src='${$(this).attr("src")}'>`);
            $(".LYAF-popup-info").css("left", e.pageX + "px");
            $(".LYAF-popup-info").css("top", e.pageY + "px");
            $(".LYAF-popup-info").show();
          }
        },
        function () {
          if ($(".LYAF-popup-info").is(":visible")) {
            $(".LYAF-popup-info img").remove();
            $(".LYAF-popup-info").hide();
          }
        }
      );
        var tableTrs = $(`.LYAF-product-list #LYAF-list tbody tr`)
        tableTrs.each(function() {
          var tds = $(this).find(`td:not([style*="display: none"])`)
          if (tds.length === 1){
            tds.css("border-radius","20px")
          }else{
            $(tds[0]).css("border-radius","20px 0 0 20px")
            $(tds[tds.length-1]).css("border-radius", "0 20px 20px 0")
          }
        })
      }
    })
})

async function getSetupList(){
  showLoading()
  let res = await fetch(window.location.origin+"/api/getSetupList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        console.log(response);
      } else {
      }
      return response.json();
    }).then((data) => {
      return data;
    });
    hideLoading()
    return res
}
