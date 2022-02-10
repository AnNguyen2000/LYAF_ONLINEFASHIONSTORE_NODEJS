
var subProduct = []
var colorList
var sizeList
$(document).ready(()=>{
    
    $(".LYAF-preview-list").each(function () {
        $(this).magnificPopup({
          delegate: ".LYAF-aaaa",
          type: "image",
          gallery: {
            enabled: true,
          },
        });
      });

    $(".LYAF-preview-list .LYAF-image-preview #size").each(async (i,v) => {
        const url = $(v)[0].dataset.url
        $(v).html(await getSize(url))
    })

    $(document).on('click', ".edit-btn", function(){
        const id = this.dataset.id
        const quantity = this.dataset.value
        const color = this.dataset.color
        const size = this.dataset.size
        $(".edit-modal .modal-title").html('Cập nhật số lượng')
        $(".edit-modal #title").html(`Cập nhật số lượng sản phẩm <b>${id}</b> với màu <b>${color}</b>, size <b>${size}</b>`)
        $(".edit-modal .confirm-update").attr("data-id", id)
        $(".edit-modal .value-update").val(quantity)
        $(".edit-modal").modal("show")
    })

    $(".edit-modal .confirm-update").click(function(){
        const id = this.dataset.id
        const quantity = Number.parseInt($(".edit-modal .value-update").val())
        const formData = new FormData()
        if (id && !Number.isNaN(quantity) && quantity > 0){
          showLoading()
            fetch(window.location.origin + '/api/product/updateQuantity', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id, quantity})
            }).then(data=>data.json())
            .then(data=>{
              if (data.code === 200){
                $(`.sub-${id} .quantity #value`).html(quantity)
                $(".edit-modal").modal("hide")
                showToast("Cập nhật số lượng", "Cập nhật thành công", "success")
              }else if (data.code===404){
                showToast("Cập nhật số lượng", "Không tìm thấy sản phẩm", "error")
              }else{
                showToast("Cập nhật số lượng", data.message, "error")
              }
              hideLoading()
            }).catch(e=>{
                showToast("Cập nhật số lượng", "Lỗi rồi", "error")
            })
        }else{
            showToast("Cập nhật số lượng", "Vui lòng nhập số lượng hợp lệ", "warning")
        }
    })

    $(".name-edit-btn").click(function(){
      const id = this.dataset.id
      $(".name-edit-modal .modal-title").html('Cập nhật tên sản phẩm')
      $(".name-edit-modal #title").html(`Bạn muốn cập nhật tên sản phẩm <b>${id}</b>`)
      $(".name-edit-modal .confirm-update").attr("data-id", id)
      $(".name-edit-modal").modal("show")
    })

    $(".name-edit-modal .confirm-update").click(function(){
      const id = this.dataset.id
      const name = $(".name-edit-modal .value-update").val()

      if (id && name){
        showLoading()
          fetch(window.location.origin + '/api/product/updateName', {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({id, name})
          }).then(data=>data.json())
          .then(data=>{
            if (data.code === 200){
              $(`#nameeee`).val(name)
              $(".name-edit-modal").modal("hide")
              showToast("Cập nhật tên", "Cập nhật tên thành công", "success")
            }else if (data.code===404){
              showToast("Cập nhật tên", "Không tìm thấy sản phẩm", "error")
            }else{
              showToast("Cập nhật tên", data.message, "error")
            }
            hideLoading()
          }).catch(e=>{
            hideLoading()
              showToast("Cập nhật tên", "Lỗi rồi", "error")
          })
      }else{
          showToast("Cập nhật tên", "Vui lòng tên hợp lệ", "warning")
      }
  })

  $(".price-edit-btn").click(function(){
    const id = this.dataset.id
    $(".price-edit-modal .modal-title").html('Cập nhật giá sản phẩm')
    $(".price-edit-modal #title").html(`Bạn muốn cập nhật giá sản phẩm <b>${id}</b>`)
    $(".price-edit-modal .confirm-update").attr("data-id", id)
    $(".price-edit-modal").modal("show")
  })

  $(".price-edit-modal .confirm-update").click(function(){
    const id = this.dataset.id
    const price = Number.parseInt($(".price-edit-modal .value-update").val())

    if (id && !Number.isNaN(price) && price > 0){
      showLoading()
        fetch(window.location.origin + '/api/product/updatePrice', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, price})
        }).then(data=>data.json())
        .then(data=>{
          if (data.code === 200){
            $(`#priceeee`).val((price*1000).toLocaleString('it-IT'))
            $(".price-edit-modal").modal("hide")
            showToast("Cập nhật giá", "Cập nhật giá thành công", "success")
          }else if (data.code===404){
            showToast("Cập nhật giá", "Không tìm thấy sản phẩm", "error")
          }else{
            showToast("Cập nhật giá", data.message, "error")
          }
          hideLoading()
        }).catch(e=>{
            hideLoading()
            showToast("Cập nhật giá", "Lỗi rồi", "error")
        })
    }else{
        showToast("Cập nhật giá", "Vui lòng giá hợp lệ", "warning")
    }
  })

  $(".sale-edit-btn").click(function(){
    const id = this.dataset.id
    $(".sale-edit-modal .modal-title").html('Cập nhật giảm giá sản phẩm')
    $(".sale-edit-modal #title").html(`Bạn muốn cập nhật giảm giá sản phẩm <b>${id}</b>`)
    $(".sale-edit-modal .confirm-update").attr("data-id", id)
    $(".sale-edit-modal").modal("show")
  })

  $(".sale-edit-modal .confirm-update").click(function(){
    const id = this.dataset.id
    const isSale = $(".sale-edit-modal input[name='sale-update']:checked").val()
    var sale = null
    if (isSale === 'true'){
        sale = Number.parseFloat($(".sale-edit-modal .value-update").val())
        
        if (sale < 0 || sale > 1 || Number.isNaN(sale)){
          showToast("Cập nhật sale", "Sale không hợp lệ", "warning")
          return
        }
    }
    if (id && isSale){
      showLoading()
      fetch(window.location.origin + '/api/product/updateSale', {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({id, isSale, sale})
      }).then(data=>data.json())
      .then(data=>{
        if (data.code === 200){
          $(`.sale-input-group`).html(isSale==='true'?`
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="isSale" id="inlineRadio1" checked value="option1">
                <label class="form-check-label" for="inlineRadio1">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text font-weight-bold">%</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Price" readonly disabled aria-label="Price" value="${sale*100}">
                    </div>
                </label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="isSale" id="inlineRadio2" readonly disabled  value="option2">
                <label class="form-check-label" for="inlineRadio2">False</label>
            </div>
          `:`
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="isSale" id="inlineRadio1" readonly disabled  value="option1">
                <label class="form-check-label" for="inlineRadio1">True</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="isSale" id="inlineRadio2" checked value="option2">
                <label class="form-check-label" for="inlineRadio2">False</label>
            </div>
          `)
          $(".sale-edit-modal").modal("hide")
          showToast("Cập nhật sale", "Cập nhật sale thành công", "success")
        }else if (data.code===404){
          showToast("Cập nhật sale", "Không tìm thấy sản phẩm", "error")
        }else{
          showToast("Cập nhật sale", data.message, "error")
        }
        hideLoading()
      }).catch(e=>{
        hideLoading()
          showToast("Cập nhật sale", "Lỗi rồi", "error")
      })
    }else{
      showToast("Cập nhật sale", "Vui lòng sale hợp lệ", "warning")
    }
  })

  $(".sale-edit-modal input[name='sale-update']").change(function(){
      const value = $(this).val()

      if (value === "true"){
        $(".sale-edit-modal .sale-input").removeClass("d-none")
      }else{
        $(".sale-edit-modal .sale-input").addClass("d-none")
      }
  })

  
  $(".new-edit-btn").click(function(){
    const id = this.dataset.id
    $(".new-edit-modal .modal-title").html('Cập nhật giá sản phẩm')
    $(".new-edit-modal #title").html(`Bạn muốn cập nhật giá sản phẩm <b>${id}</b>`)
    $(".new-edit-modal .confirm-update").attr("data-id", id)
    $(".new-edit-modal").modal("show")
  })

  $(".new-edit-modal .confirm-update").click(function(){
    const id = this.dataset.id
    const isNew = $(".new-edit-modal input[name='new-update']:checked").val()
    if (id && isNew){
      showLoading()
        fetch(window.location.origin + '/api/product/updateNew', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({id, isNew})
        }).then(data=>data.json())
        .then(data=>{
          if (data.code === 200){
            $(`.new-input-group`).html(isNew==='true'?`
              <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="isNew" id="inlineRadio1" checked value="option1">
                  <label class="form-check-label" for="inlineRadio1">True</label>
              </div>
              <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="isNew" id="inlineRadio2"  readonly disabled   value="option2">
                  <label class="form-check-label" for="inlineRadio2">False</label>
              </div>
            `:`
              <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="isNew" id="inlineRadio1" readonly disabled  value="option1">
                  <label class="form-check-label" for="inlineRadio1">True</label>
              </div>
              <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="isNew" id="inlineRadio2" checked value="option2">
                  <label class="form-check-label" for="inlineRadio2">False</label>
              </div>
            `)
            $(".new-edit-modal").modal("hide")
            showToast("Cập nhật tình trạng", "Cập tình trạng giá thành công", "success")
          }else if (data.code===404){
            showToast("Cập nhật tình trạng", "Không tìm thấy sản phẩm", "error")
          }else{
            showToast("Cập nhật tình trạng", data.message, "error")
          }
          hideLoading()
        }).catch(e=>{
          hideLoading()
            showToast("Cập nhật tình trạng", e, "error")
        })
    }else{
        showToast("Cập nhật tình trạng", "Vui lòng giá hợp lệ", "warning")
    }
  })

  
  tinymce.init({
    height: "300",
    selector: ".desc-edit-modal #desc-update",
    plugins:
      "advlist autolink lists link image charmap print preview hr anchor pagebreak",
    toolbar_mode: "floating",
  });

  
  $(".desc-edit-btn").click(function(){
    const id = this.dataset.id
    $(".desc-edit-modal .modal-title").html('Cập nhật mô tả sản phẩm')
    $(".desc-edit-modal #title").html(`Bạn muốn cập nhật mô tả sản phẩm <b>${id}</b>`)
    $(".desc-edit-modal .confirm-update").attr("data-id", id)
    $(".desc-edit-modal").modal("show")
  })

  $(".desc-edit-modal .confirm-update").click(function(){
    const id = this.dataset.id
    const desc = tinymce.get("desc-update").getContent()
    if (id && desc){
      showLoading()
        fetch(window.location.origin + '/api/product/updateDesc', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, desc})
        }).then(data=>data.json())
        .then(data=>{
          if (data.code === 200){
            $(`.LYAF-product-description #desc`).html(desc)
            $(".desc-edit-modal").modal("hide")
            showToast("Cập nhật mô tả", "Cập nhật mô tả thành công", "success")
          }else if (data.code===404){
            showToast("Cập nhật mô tả", "Không tìm thấy sản phẩm", "error")
          }else{
            showToast("Cập nhật mô tả", data.message, "error")
          }
          hideLoading()
        }).catch(e=>{
          hideLoading()
            showToast("Cập nhật mô tả", "Lỗi rồi", "error")
        })
    }else{
        showToast("Cập nhật mô tả", "Vui lòng mô tả hợp lệ", "warning")
    }
  })

  $(".images-edit-btn").click(function(){
    const id = this.dataset.id
    $(".images-edit-modal .modal-title").html('Cập nhật ảnh sản phẩm')
    $(".images-edit-modal #title").html(`Bạn muốn cập nhật ảnh sản phẩm <b>${id}</b>`)
    $(".images-edit-modal .confirm-update").attr("data-id", id)
    $(".images-edit-modal").modal("show")
  }) 

  $(document).on("click", ".images-edit-modal .LYAF-preview-list .remove-image-btn", function () {
    $(this).parent().remove();
    $(".images-edit-modal .LYAF-preview-wrapper .info").html(
      `${$(".images-edit-modal .LYAF-preview-list .LYAF-image-preview").length} images`
    );
  });

  $(".images-edit-modal .image-upload").change(function () {
    var files = $(".images-edit-modal .image-upload")[0].files;
    for (var f of files) {
      var uuid = uuidv4();
      if (f) {
        var size = humanFileSize(f.size);
        $(".images-edit-modal .LYAF-preview-list").prepend(`
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
              <span class="remove-image-btn"><i class="fa fa-trash"></i></span>
            </div>
        `);
      }
    }
    $(".images-edit-modal .LYAF-preview-wrapper .info").html(
      `${$(".images-edit-modal .LYAF-preview-list .LYAF-image-preview").length} images`
    );
    $(".images-edit-modal .image-upload").val(null);
  });

  var drake = dragula([document.querySelector(".images-edit-modal .LYAF-preview-list")], {
    revertOnSpill: false,
    moves: function (el, container, handle) {
      return $(handle).hasClass("$@da@#");
    },
  });

  drake.on("drop", function (el, target, source, sibling) {
    $(".images-edit-modal .LYAF-preview-container .info").html(
      `${$(".images-edit-modal .LYAF-preview-list .LYAF-image-preview").length} images`
    );
  });

  var scroll = autoScroll(
    [
      window,
      document.querySelector(".images-edit-modal .LYAF-preview-list"),
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


  $(".images-edit-modal .confirm-update").click(async function(){
    const id = this.dataset.id
    const images = await getImagesObject()
    if (id && images.length){
      if (images.length < 5 || images.length > 10){
        showToast("Cập nhật ảnh", "Vui lòng chỉ thêm từ 5 đến 10 ảnh", "warning")
      }else{
        const formData = new FormData()
        images.forEach(f => {
          formData.append("images", f)
        })
        formData.append("id", id)
        showLoading()
        fetch(window.location.origin + '/api/product/updateImages', {
            method: "POST",
            body: formData
        }).then(data=>data.json())
        .then(async data=>{
          if (data.code === 200){
              fetch(window.location.origin + '/api/product/getImages?id='+id)
              .then(data=>data.json())
              .then(data=>{
                const resultImages = data.data
                $(".image-update-input .LYAF-image-preview").remove()
                resultImages.forEach(async url => {
                  var n = url.lastIndexOf('/');
                  var name = url.substring(n + 1);
                  var file = await urlToObject(url, name)
                  var size = humanFileSize(file.size);
                  $(".image-update-input").append(`
                    <div class="LYAF-image-preview">
                      <a class="LYAF-aaaa" href="${url}">
                      <img src="${url}" class="$@da@# " height="auto" width="100">
                      </a>
                      <span class="image-info font-weight-bold">
                        <span class="LYAF-asssA">
                          <span id="thumbnail"></span>
                        </span>
                        <span id="name">${name}</span>
                        <span id="size">${size}</span>
                      </span>
                    </div>
                  `)
              })
              $(".image-update-input .LYAF-preview-container .info").html(
                `${$(".image-update-input .LYAF-preview-list .LYAF-image-preview").length} images`
              );
            $(".images-edit-modal").modal("hide")
            showToast("Cập nhật ảnh", "Cập nhật ảnh thành công", "success")
              })
          }else if (data.code===404){
            showToast("Cập nhật ảnh", "Không tìm thấy sản phẩm", "error")
          }else{
            showToast("Cập nhật ảnh", data.message, "error")
          }
          hideLoading()
        }).catch(e=>{
            showToast("Cập nhật ảnh", "Lỗi rồi", "error")
        })
      }
    }else{
        showToast("Cập nhật ảnh", "Thêm ảnh", "warning")
    }
  })
  
  $(".sub-edit-btn").click(function(){
    subProduct = getSubProduct();
    const id = this.dataset.id
    $(".sub-edit-modal .modal-title").html('Cập nhật sản phẩm phụ')
    $(".sub-edit-modal #title").html(`Bạn muốn cập nhật sản phẩm phụ`)
    $(".sub-edit-modal .confirm-update").attr("data-id", id)
    $(".sub-edit-modal").modal("show")
  })

  $(".sub-edit-modal .confirm-update").click(function(){
    const id = this.dataset.id
    const subList = getSubProduct()
    if (id && subList.length){
      showLoading()
        fetch(window.location.origin + '/api/product/updateSub', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, subList})
        }).then(data=>data.json())
        .then(data=>{
          if (data.code === 200){
            $(".sub-product-preview .LYAF-sub-products-list .sub-product").remove()
            const subListUpdate = data.data
            subListUpdate.forEach(v=>{
              $(".sub-product-preview .LYAF-sub-products-list").append(`
                <div class="sub-product sub-${v._id}">
                    <div class="sub-p-infor">
                        <table>
                            <tr>
                                <td><div class="id">
                                    <strong>Mã: </strong>
                                    <span id="id">${v._id}</span>
                                    </div>
                                </td>
                                <td><div class="color">
                                    <strong>Màu: </strong>
                                    <span id="value">${v.colorId.name}</span>
                                    </div>
                                </td>
                                <td><div class="size">
                                        <strong>Size: </strong>
                                        <span id="value">${v.sizeId.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="quantity">
                                        <strong>Số lượng: </strong>
                                        <span id="value">${v.quantity}</span>
                                        <span class="edit-btn" id="edit-btn"  data-id="${v._id}" data-value="${v.quantity}" data-size="${v.sizeId.name}" data-color="${v.colorId.name}"><i class="fas fa-edit"></i></span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
              `)
            })
            $(".sub-product-preview .info").html(subListUpdate.length + ' products')
            $(".sub-edit-modal").modal("hide")
            showToast("Cập nhật sản phẩm phụ", "Cập nhật sản phẩm phụ thành công", "success")
          }else if (data.code===404){
            showToast("Cập nhật sản phẩm phụ", "Không tìm thấy sản phẩm", "error")
          }else{
            showToast("Cập nhật sản phẩm phụ", data.message, "error")
          }
          hideLoading()
        }).catch(e=>{
          hideLoading()
            showToast("Cập nhật sản phẩm phụ", "Lỗi rồi", "error")
        })
    }else{
        showToast("Cập nhật sản phẩm phụ", "Vui lòng sản phẩm phụ hợp lệ", "warning")
    }
  })
    
  $(".sub-edit-modal .LYAF-sub-products-add .add-sub-product").click(() => {
    $(".add-sub-modal").modal("show");
  });
  getSetupList().then(data=>{
    colorList = data.colors.data
    sizeList = data.sizes.data
    if ($(".color-selecter")) {
      colorList.forEach((_) =>
        $(".color-selecter").append(
          `<option value="${_._id}" data-image="${_.thumbnail}" data-name="${_.name}">${_.name}</option>`
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
      new lc_select(".color-selecter, .size-selecter", {
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
  })
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
        $(".sub-edit-modal .LYAF-sub-products-list").append(`
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
        subProduct.push({ colorId, sizeId, quantity });
        $(".add-sub-modal").modal("hide");
        $(".sub-edit-modal .LYAF-sub-products-add .info").html(subProduct.length + ' products')
      }
    }else{
      showToast("Thêm sản phẩm phụ", "Vui lòng chọn đầy đủ thuộc tính", "warning")
    }
  });

  $(document).on('click', '.sub-edit-modal .sub-product .remove-sub-btn', function(){
    const color = $(this).parent().find("#color").val()
    const size = $(this).parent().find("#size").val()
    const value = subProduct.find(v=> v.colorId === color && v.sizeId === size)
    const index = subProduct.indexOf(value);
    if (index > -1) {
      subProduct.splice(index, 1);
      $(this).parent().remove()
      $(".sub-edit-modal .LYAF-sub-products-add .info").html(subProduct.length + ' products')
    }else{
      showToast("Xoá sản phẩm phụ", "Không thể xoá", "warning")
    }
  })

  $(".LYAF-remove-product-btn").click(()=>{
    $(".remove-product-confirm").modal("show")
  })
  
  $(".remove-product-confirm .confirm-remove").click(()=>{
    const id = $("#LYAF-the-product-id").val()
    const confirmId = $(".remove-product-confirm .remove-product-infor #confirm-code").val()
    if (id === confirmId){
        showLoading()
        fetch(window.location.origin + '/api/product/removeProduct', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        }).then(data=>data.json())
        .then(data=>{
          if (data.code === 200){
            hideLoading() 
            showToast("Xoá sản phẩm", "Xoá sản phẩm thành công", "success")
            setTimeout(()=>{window.location.href = '/manager/list'}, 100)
          }else if (data.code===404){
            showToast("Xoá sản phẩm", "Không tìm thấy sản phẩm", "error")
          }else{
            showToast("Xoá sản phẩm", data.message, "error")
          }
          hideLoading()
        }).catch(e=>{
          hideLoading()
            showToast("Xoá sản phẩm", e, "error")
        })
    }else{
      showToast("Xoá sản phẩm", "Mã xác nhận không đúng", "warning")
     $(".remove-product-confirm .remove-product-infor #confirm-code").val('')
    }
  })
  

})


function checkDuplicate(size, color){
  var check = false
  subProduct.forEach(_=>{
    if (_.sizeId === size && _.colorId === color){
      check = true
    }
  })
  return check
}

function setUpsubProduct(colorId) {
  var selectedSize = subProduct.map((_) => {
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

function getSubProduct() {
  var subProduct = []
  $(".sub-edit-modal .LYAF-sub-products-list .sub-product").each((i,v)=>{
    var colorId = $(v).find('#color').val()
    var sizeId = $(v).find('#size').val()
    var quantity = $(v).find('#quantity').val()
    subProduct.push({colorId, sizeId, quantity})
  })
  return subProduct
}

async function getImagesObject() {
  var fileInput = await Promise.all($(".images-edit-modal .LYAF-image-preview .LYAF-aaaa").map(async (i, v) => {
    var url = $(v).attr("href");
    var file = await urlToObject(url, url);
    return file
  }));
  return fileInput;
}

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
const getSize = async (url)=> {
    const file = await urlToObject(url)
    return humanFileSize(file.size, "");
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