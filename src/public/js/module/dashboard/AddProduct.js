var G_DATA = {
  name: "",
  price: 0,
  desc: "",
  categoryId: "",
  images: [],
  subProduct: [],
};

var colorList;
var sizeList;
var categoryList;

$(document).ready(() => {
  getSetupList().then(data=>{
    colorList = data.colors.data
    sizeList = data.sizes.data
    categoryList = data.categories.data
    if ($(".color-selecter")) {
      colorList.forEach((_) =>
        $(".color-selecter").append(
          `<option value="${_._id}" data-image="${_.thumbnail}" data-name="${_.name}">${_.name}</option>`
        )
      );
    }
    if ($(".category-selecter")) {
      categoryList.forEach((_) =>
        $(".category-selecter").append(
          `<option value="${_._id}" data-name="${_.name}">${_.name}</option>`
        )
      );
    }
    if ( $(".size-selecter")){
      sizeList.forEach((_)=>{
        $(".size-selecter").append(
          `<option value="${_._id}" data-name="${_.name}">${_.name} - ${_.desc}</option>`
        );
      })
    }
  
    // LC_SELECT
    if ($(".LYAF-selecter")[0])
      new lc_select(".color-selecter, .category-selecter, .size-selecter", {
        enable_search: true,
        min_for_search: 7,
        autofocus_search: false,
        wrap_width: "100%",
        pre_placeh_opt: false,
        max_opts: false,
        on_change: function (val, ele) {
          if ($(ele).hasClass("color-selecter")) {
            setUpsubProduct(val[0]);
          }
        },
        labels: [
          "search options",
          "add options",
          "Select options ..",
          ".. no matching options ..",
        ],
      });
  
    if ($(".LYAF-advanced-select")[0]) {
      $(document).on("click", ".LYAF-advanced-option", function () {});
    }
  
    $(".LYAF-product-name input").on("input", () => {
      $(".product-name").html($(".LYAF-product-name input").val());
    });
  
    if ($(".LYAF-preview-list")[0]) {
      var drake = dragula([document.querySelector(".LYAF-preview-list")], {
        revertOnSpill: false,
        moves: function (el, container, handle) {
          return $(handle).hasClass("$@da@#");
        },
      });
  
      drake.on("drop", function (el, target, source, sibling) {
        $(".LYAF-preview-container .info").html(
          `${$(".LYAF-preview-list .LYAF-image-preview").length} images`
        );
        $(".LYAF-remove-container .info").html(
          `${$(".LYAF-remove-list .LYAF-image-preview").length} images`
        );
      });
  
      var scroll = autoScroll(
        [
          window,
          document.querySelector(".LYAF-preview-list"),
          // document.querySelector('.LYAF-remove-list'),
        ],
        {
          margin: 100,
          maxSpeed: 6,
          scrollWhenOutside: true,
          autoScroll: function () {
            return this.down && drake.dragging;
          },
        }
      );
  
      $(document).on(
        "click",
        ".LYAF-preview-list .LYAF-image-preview .LYAF-image-preview-edit .dropdown-menu",
        (e) => {
          e.stopPropagation();
        }
      );
  
      $(".LYAF-preview-list").each(function () {
        $(this).magnificPopup({
          delegate: ".LYAF-aaaa",
          type: "image",
          gallery: {
            enabled: true,
          },
        });
      });
    }
  
    tinymce.init({
      height: "300",
      selector: "textarea",
      plugins:
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
      toolbar_mode: "floating",
    });
  
    $(".LYAF-thumbnail .thumbnail-upload-holder").magnificPopup({
      delegate: "a",
      type: "image",
    });
  
    $(".LYAF-dasboard-body .LYAF-dashboard-block i").hover(
      function () {
        if (!$(this).parent().find(".LYAF-tooltip").is(":visible"))
          $(this).parent().find(".LYAF-tooltip").fadeIn(200);
      },
      function () {
        if ($(this).parent().find(".LYAF-tooltip").is(":visible"))
          $(this).parent().find(".LYAF-tooltip").fadeOut(200);
      }
    );
  
    $(".image-upload").change(function () {
      var files = $(".image-upload")[0].files;
      for (var f of files) {
        var uuid = uuidv4();
        if (f) {
          var size = humanFileSize(f.size);
          $(".LYAF-preview-list").prepend(`
              <div class="LYAF-image-preview preview-${uuid}">
                <a class="LYAF-aaaa" href="${URL.createObjectURL(
                  f
                )}" data-name="${f.name}">
                  <img src="${URL.createObjectURL(
                    f
                  )}" class="$@da@# " height="auto" width="100">
                </a>
                <span class="image-info font-weight-bold">
                  <span class="LYAF-asssA">
                    <span id="thumbnail"></span>
                  </span>
                  <span id="name">${f.name}</span>
                  <span id="size">${size}</span>
                </span>
                <div class="LYAF-image-preview-edit dropdown show">
                  <a class="dropdown-toggle" href="javascript:void(0)" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-ellipsis-h"></i>
                  </a>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <div class="form-group form-check">
                      <input type="checkbox" class="form-check-input set-thumbnail" data-id="${uuid}" id="set-thumbnail-${uuid}">
                      <label class="form-check-label" data-id="${uuid}" for="set-thumbnail-${uuid}">Set as thumbnail <span id="number">0/2</span></label>
                    </div>
                    <hr>
                    <a class="dropdown-item crop-image" data-id="${uuid}" href="javascript:void(0)">Crop image</a>
                  </div>
                </div>
                <span class="remove-image-btn"><i class="fa fa-trash"></i></span>
              </div>
          `);
        }
      }
      $(".LYAF-preview-container .info").html(
        `${$(".LYAF-preview-list .LYAF-image-preview").length} images`
      );
      $(".image-upload").val(null);
      updateInput();
    });
  
    $(document).on("change", ".set-thumbnail", function () {
      var id = this.dataset.id;
      toggleThumbnail(id);
    });
  
    $(document).on("click", ".LYAF-preview-list .remove-image-btn", function () {
      $(this).parent().remove();
      $(".LYAF-preview-container .info").html(
        `${$(".LYAF-preview-list .LYAF-image-preview").length} images`
      );
    });
  
    $(".remove-image").click(() => {
      $(".LYAF-remove-container .LYAF-image-preview").remove();
      $(".LYAF-remove-container .info").html(
        `${$(".LYAF-remove-list .LYAF-image-preview").length} images`
      );
    });
  
    $(document).on("click", ".remove-image-btn", function () {
      $(this).parent().find(".image-name");
    });
  
    $(".thumbnail-upload-holder input").change(function () {
      var currentParent = $(this).parent();
      var file = currentParent.find("input")[0].files[0];
      currentParent.find("p").hide();
      currentParent.find("input").hide();
      currentParent.find("#thumbnail-preview")[0].src = URL.createObjectURL(file);
      currentParent.find("a").attr("href", URL.createObjectURL(file));
      currentParent.find("#thumbnail-preview")[0].onload = function () {
        URL.revokeObjectURL(currentParent.find("#thumbnail-preview")[0].src); // free memory
      };
      currentParent.find("#thumbnail-preview").show();
      currentParent.find(".remove-thumbnail").show();
    });
  
    $(".LYAF-thumbnail .LYAF-thumbnail-input .remove-thumbnail").click(
      function () {
        var currentParent = $(this).parent();
        currentParent.find("p").show();
        currentParent.find("input").show();
        currentParent.find("#thumbnail-preview").hide();
        currentParent.find("a").attr("href", null);
        currentParent.find(".remove-thumbnail").hide();
        currentParent.find("#thumbnail-preview")[0].src = "";
        currentParent.find("input").val(null);
      }
    );
  
    $(".LYAF-sub-products-add .add-sub-product").click(() => {
      $(".add-sub-modal").modal("show");
    });
  
    $(".add-sub-modal .save").click(() => {
      var sizeId = $(".size-selecter").find(":selected").val();
      var colorId = $(".color-selecter").find(":selected").val();
      var size = sizeList.find((_) => _._id == sizeId);
      var color = colorList.find((_) => _._id == colorId);
      var quantity = Number.parseInt($(".add-sub-modal #quantity").val());
      if (size && color && quantity > 0){
        if (checkDuplicate(size._id, color._id)){
          showToast("Thêm sản phẩm phụ", "Đã có sản phẩm phụ này", "warning")
        }else{
          $(".LYAF-sub-products-list").append(`
          <div class="sub-product">
              <input type="hidden" id="color" value="${colorId}">
              <input type="hidden" id="size" value="${sizeId}">
              <input type="hidden" id="quantity" value="${quantity}">
              <div class="sub-p-infor">
                <div class="color">
                    <strong>Color: </strong>
                    <span id="value">${color.name}</span>
                </div>
                <div class="size">
                    <strong>Size: </strong>
                    <span id="value">${size.name}</span>
                </div>
                <div class="quantity">
                    <strong>Quantity: </strong>
                    <span id="value">${quantity}</span>
                </div>
            </div>
            <span class="remove-sub-btn"><i class="fa fa-trash"></i></span>
          </div>`);
          G_DATA.subProduct.push({ colorId, sizeId, quantity });
          $(".add-sub-modal").modal("hide");
          $(".LYAF-sub-products-add .info").html(G_DATA.subProduct.length + ' products')
        }
      }else{
        showToast("Thêm sản phẩm phụ", "Vui lòng chọn đầy đủ thuộc tính", "warning")
      }
    });

    $(document).on('click', '.sub-product .remove-sub-btn', function(){
      const color = $(this).parent().find("#color").val()
      const size = $(this).parent().find("#size").val()
      const value = G_DATA.subProduct.find(v=> v.colorId === color && v.sizeId === size)
      const index = G_DATA.subProduct.indexOf(value);
      if (index > -1) {
        G_DATA.subProduct.splice(index, 1);
        $(this).parent().remove()
        $(".LYAF-sub-products-add .info").html(G_DATA.subProduct.length + ' products')
      }else{
        showToast("Xoá sản phẩm phụ", "Không thể xoá", "warning")
      }
    })

    $(".LYAF-save-new").click(async ()=>{
      var data = await extractData()
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("desc", data.desc)
      formData.append("categoryId", data.categoryId)
      formData.append("price", data.price)
      data.images.forEach(f => {
        formData.append("images", f)
      })
      data.subProduct.forEach(s => {
        formData.append("subProduct", JSON.stringify(s))
      })
      showLoading()
      fetch(window.location.origin+'/api/product/add',{
        method: "POST",
        body: formData,
      })
      .then(data=>data.json())
      .then(data=>{
        if (data.errors){
          var err = data.errors
          for (var prop in err) {
            showToast(err[prop].param, err[prop].msg, "warning")
            break;
          } 
        }else{
          if (data.code === 200){
            hideLoading()
            showToast("Thêm sản phẩm", "Thêm thành công")
            setTimeout(() => {window.location.href = '/manager/product/detail/'+ data.productId},500)
          }else{
            showToast("Thêm sản phẩm", data.message, "error")
          }
        }
        hideLoading()
      })
    })
  })
});

function checkDuplicate(size, color){
  var check = false
  G_DATA.subProduct.forEach(_=>{
    if (_.sizeId === size && _.colorId === color){
      check = true
    }
  })
  return check
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Extract input to json data.
 *
 * @return JSON.
 */
async function extractData() {
  await updateInput()
  return G_DATA;
}

/**
 * Convert url to File.
 *
 * @param an url.
 *
 * @return An File object.
 */
const urlToObject = async (url, name) => {
  const response = await fetch(url);
  // here image is url/location of image
  const blob = await response.blob();
  const file = new File([blob], name, { type: blob.type });
  return file;
};

/**
 * Generate uuid
 *
 * @return an id.
 */
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

async function updateInput() {
  // NAME
  G_DATA.name = $(".LYAF-product-name input").val();
  // DESCRIPTION
  G_DATA.desc = tinyMCE.get("desc").getContent();
  // CATEGORY
  G_DATA.categoryId = $(".category-selecter").find(":selected").val();
  // PRICE
  G_DATA.price = $(".LYAF-product-price input").val();
  // IMAGES
  G_DATA.images = await getImagesObject();
  // subProduct
  G_DATA.subProduct = getSubProduct();
}

function setUpsubProduct(colorId) {
  var selectedSize = G_DATA.subProduct.map((_) => {
    if (_.colorId == colorId) return _.sizeId;
  });
  const select = document.querySelector(".size-selecter");
  $(".size-selecter option").remove();
  const destroyEvent = new Event("lc-select-destroy");
  select.dispatchEvent(destroyEvent);
  sizeList.forEach((_) => {
    if (!selectedSize.includes(_._id))
      $(".size-selecter").append(
        `<option value="${_._id}" data-name="${_.name}">${_.name} - ${_.desc}</option>`
      );
  });
  new lc_select(".size-selecter", {
    enable_search: true,
  });
}

function getSubProduct() {
  var subProduct = []
  $(".LYAF-sub-products-list .sub-product").each((i,v)=>{
    var colorId = $(v).find('#color').val()
    var sizeId = $(v).find('#size').val()
    var quantity = $(v).find('#quantity').val()
    subProduct.push({colorId, sizeId, quantity})
  })
  return subProduct
}

async function getImagesObject() {
  var fileInput = await Promise.all($(".LYAF-image-preview .LYAF-aaaa").map(async (i, v) => {
    var url = $(v).attr("href");
    var name = $(v).attr("data-name");
    var file = await urlToObject(url, name);
    return file
  }));
  return fileInput;
}

function toggleThumbnail(id) {
  if ($(`.preview-${id} #thumbnail`).hasClass("set")) {
    $(`.preview-${id} #thumbnail`).removeClass("set");
    $(`.preview-${id} #thumbnail`).html("");
  } else {
    $(`.preview-${id} #thumbnail`).addClass("set");
    $(`.preview-${id} #thumbnail`).append('<i class="fas fa-star"></i>');
  }
}

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
