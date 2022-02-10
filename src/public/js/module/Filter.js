var G_CURRENT_TAG
export class Filter {

    tags = [
    ]
    
    constructor(elementClassName, {data, submit, sizeList, colorList, categoryList}){
        this.elementClassName = elementClassName
        this.data = data
        this.submit = submit
        $(`.${elementClassName}`).append(generateFilter(this.data, this.tags))
  
       // DROPDOWN MENU FILTER 
      $(`.${elementClassName} .LYAF-product-filter-add-btn`).click(function(){
        $(`.${elementClassName} .LYAF-product-filter-add .child-menu`).hide();
      })
      $(`.${elementClassName} .LYAF-product-filter-add`).on("click", ".dropdown-menu", (e) => {
        e.stopPropagation();
      });
      $(`.${elementClassName} .LYAF-product-filter-add .btn-group`).on('hide.bs.dropdown', function (e) {
        if (e.clickEvent && ($(e.clickEvent.target).closest('#lc-select-dd')[0] || $(e.clickEvent.target).closest('.lcslt-multi-selected')[0])) {
          e.preventDefault();
        }
      });
    // END DROPDOWN MENU FILTER
  
    // LC_SELECT SETUP
    this.select = new lc_select(`.${elementClassName} .LYAF-selecter`, {
      wrap_width: "100%",
      pre_placeh_opt: true,
      on_change: function (val, target) {
        var property = target.dataset.filter
        var name = target.dataset.name
        var action = "category"
        console.log(val)
        var value = val.map(ID=>(eval(property+'List')).find(_ => _["_id"]===ID))
        if (!value.length){
          $(`.${elementClassName} .filter-${property} #content`).html("")
          G_CURRENT_TAG = null
        }else{
          G_CURRENT_TAG = {
              property,
              name,
              action,
              value,
          }
          $(`.${elementClassName} .filter-${property} #content`).html(generateTag(G_CURRENT_TAG))
        }
      },
    })
  
    if ($(`.${elementClassName} #filter-size-select`)) {
      sizeList.forEach((_) =>
        $(`.${elementClassName} #filter-size-select`).append(
          `<option value="${_._id} data-name="${_.name}">${_.name} - ${_.desc}</option>`
        )
      );
    }
    if ($(`.${elementClassName} #filter-category-select`)) {
      categoryList.forEach((_) =>
          $(`.${elementClassName} #filter-category-select`).append(
            `<option value="${_._id}" data-name="${_.name}">${_.parentId?`<span class="ml-3">${_.name}</span>`:`<strong>${_.name}</strong>`}</option>`
          )
      );
    }
    if ($(`.${elementClassName} #filter-color-select`)) {
      colorList.forEach((_) =>
        $(`.${elementClassName} #filter-color-select`).append(
          `<option value="${_._id}" data-name="${_.name}" data-image="/img/${_.thumbnail}">${_.name}</option>`
        )
      );
    }
    // END LC_SELECT SETUP
  
      $(`.${elementClassName} .menu-toggle-btn`).click(function(){
        if ($(window).width() > 620 ){
          const resyncEvent = new Event('lc-select-refresh');
          document.querySelector(`.${elementClassName} .LYAF-selecter`).dispatchEvent(resyncEvent);
          $(`.${elementClassName} .LYAF-product-filter-add .child-menu`).hide();
          $(`.${elementClassName} .filter-${this.dataset.filter}`).show();
        }else{
          $(`.${elementClassName} #filter-modal-${this.dataset.filter}`).modal("show");
        }
      })
  
      $(`.${elementClassName} .filter-radio-toggle`).click(function(){
          var filterType = this.name
          var inputId = this.dataset.toggle
          $(`.${elementClassName} .filter-${filterType} .input-value input`).attr('readonly', true)
          $(`.${elementClassName} .filter-${filterType} #${inputId} input`).attr('readonly', false)
          $(`.${elementClassName} .filter-${filterType} .input-value input`).attr('disabled', 'disabled')
          $(`.${elementClassName} .filter-${filterType} #${inputId} input`).removeAttr('disabled')
      })

      console.log($(`.${elementClassName} #my-date`))
      $(`.${elementClassName} #my-date`).change(function() {
        const attr = $(this).attr("type")
        var date = $(this).val();

        var property = 'date'
        var name = 'Date'
        var action = 'date'
        G_CURRENT_TAG = {
            property,
            name,
            action,
            value: ''
        }
        switch(attr){
          case "date":
            G_CURRENT_TAG.value ={
              start: new Date(date)
            }
            break;
          case "week":
            var week = getWeekDateRange(date)
            G_CURRENT_TAG.value ={
              start: week.start,
              end: week.end
            }
            break;
          case "month":
            var month = getMonthDateRange(date.split('-')[0], date.split('-')[1])
            G_CURRENT_TAG.value ={
              start: month.start.toDate(),
              end: month.end.toDate()
            }
            break;
        }
        $(`.${elementClassName} .filter-${property} #content`).html(generateTag(G_CURRENT_TAG))
    });

      $(`.${elementClassName} .value-input`).on('input',function() {
          var property = this.dataset.filter
          var name = this.dataset.name
          var action = $(`.${elementClassName} .filter-${property} .filter-radio-toggle:checked`)[0].dataset.action
          var value =  action !== "between"?this.value:{
            from : $(`.${elementClassName} .filter-${property} #${property}-input-from`).val(),
            to : $(`.${elementClassName} .filter-${property} #${property}-input-to`).val()
          } 
          if (value === "" || value === null){
            $(`.${elementClassName} .filter-${property} #content`).html("")
            G_CURRENT_TAG = null
          }else{
            G_CURRENT_TAG = {
                property,
                name,
                action,
                value,
            }
            $(`.${elementClassName} .filter-${property} #content`).html(generateTag(G_CURRENT_TAG))
          }
      })

      const addTags = () => {
        if (G_CURRENT_TAG){
          var value = this.tags.find(_ => _.property === G_CURRENT_TAG.property)
          var indx = this.tags.indexOf(value);
          if (indx > -1){
            this.tags.splice(indx, 1)
          }
          this.tags.push(G_CURRENT_TAG)
        }
        $(`.${elementClassName} #tag`).remove()
        $(showTags(this.tags)).insertAfter(`.${elementClassName} .LYAF-product-filter-search`)
      }

      const removeTags = (property) => {
        var value = this.tags.find(_ => _.property === property)
        var indx = this.tags.indexOf(value);
        if (indx > -1){
          this.tags.splice(indx, 1)
        }
        $(`.${elementClassName} #tag`).remove()
        $(showTags(this.tags)).insertAfter(`.${elementClassName} .LYAF-product-filter-search`)
      }

      $(`.${elementClassName} #add-filter`).on('click', function(){
        addTags()
        var property = this.dataset.menu
        $(`.${elementClassName} .filter-${property} #content`).html("")
        $(`.${elementClassName} .filter-${property} input`).val(null)
        $(`.${elementClassName} .filter-${property} input`).prop('checked', false)
        $(`.${elementClassName} .filter-${property} input`).attr('readonly', true)
        G_CURRENT_TAG = null
        $(`.${elementClassName} .dropdown-toggle`).dropdown('toggle');
      })

      $(`.${elementClassName} #cancel-filter`).on('click', function(){
        var property = this.dataset.menu
        $(`.${elementClassName} .filter-${property} #content`).html("")
        $(`.${elementClassName} .filter-${property} input`).val(null)
        $(`.${elementClassName} .filter-${property} input`).prop('checked', false)
        $(`.${elementClassName} .filter-${property} input`).attr('readonly', true)
        G_CURRENT_TAG = null
        $(`.${elementClassName} .child-menu`).hide();
      })


      $(`.${elementClassName} .LYAF-product-filter-search`).on('click', () => {
        this.extractTags()
      })

      $(document).on('click', `.${elementClassName} #tag`, function(){
        const property = this.dataset.property
        removeTags(property)
      })

    }

    extractTags = () => {
      this.submit()
    }
  }

 const generateFilter = (data, tags) => {
    var filters = data.map(_=>`
        <div class="btn-group dropright" style="width: 100%;">
            <button href="javascript:void(0)" data-filter="${_.property}" class="dropdown-item menu-toggle-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${_.title}</button>
            <div class="dropdown-menu child-menu filter-${_.property}" data-filter="${_.property}">
                <div id="filter-title">
                    <h5 class="text-uppercase font-weight-bold">${_.title}</h5>
                </div>
                <div id="filter-tag-preview">
                    <span>Tag: </span>
                    <span id="content"></span> 
                </div>
                <hr>
                <div id="filter-menu" data-filter="${_.property}">
                    ${filterType[_.type](_)}
                </div>
                <hr>
                <div id="filter-menu-action-btn">
                    <button type="button" class="btn btn-secondary" id="cancel-filter" data-menu="${_.property}">Cancel</button>
                    <button type="button" class="btn btn-primary" id="add-filter" data-menu="${_.property}">Add</button>
                </div>
            </div>
        </div>
    `)

    var filterModal = data.map(_=>`
    <!-- Modal -->
    <div class="modal fade LYAF-filter-modal" id="filter-modal-${_.property}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><strong>${_.title}</strong></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body filter-${_.property}" >
            <div id="filter-tag-preview">
                <span>Tag: </span>
                <span id="content"></span> 
            </div>
            <hr>
            <div id="filter-menu" data-filter="${_.property}">
                ${filterType[_.type](_)}
            </div>
          </div>
          <div class="modal-footer">
            <div id="filter-menu-action-btn">
                <button type="button" class="btn btn-secondary" id="cancel-filter" data-menu="${_.property}" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="add-filter" data-menu="${_.property}" data-dismiss="modal">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
`)
    return `
        <div class="LYAF-product-filter-wrapper">
          <div class="LYAF-product-filter">
              <div class="LYAF-product-filter-add">
                  <div class="btn-group">
                      <div class="LYAF-product-filter-add-btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span>Filter <i class="fas fa-filter"></i></span>
                      </div>
                      <div class="dropdown-menu parent-menu id-menu">
                          ${filters.join('')}
                      </div>
                  </div>
              </div>
              <div class="LYAF-product-filter-search">
                  <span>Apply filters <i class="fas fa-search"></i></span>
              </div>
              ${showTags(tags)}
          </div>
          ${filterModal.join('')}
        </div>`
}


const showTags = (tags) => {
    return tags.map(_ => `<span data-property="${_.property}" id="tag">${generateTag(_)}<i class="fas fa-times"></i></span>`).join('')
}

const generateTag = (tag) => {
    switch (tag.action){
        case "contain":
            return `<strong>${tag.name}</strong> contains<b><i> "${tag.value}"</i></b>`
            break;
        case "category":
            return `<strong>${tag.name}</strong> has <b><i>${tag.value.map(_=> `${_.name}`).join(', ')}</i></b>`
            break;
        case "equal":
            return `<strong>${tag.name}</strong> equals to <b><i>${tag.property==='price'?`${(tag.value*1000).toLocaleString('it-IT')} VNĐ`:tag.value}</i></b>`
            break;
        case "greater":
            return `<strong>${tag.name}</strong> greater than <b><i>${tag.property==='price'?`${(tag.value*1000).toLocaleString('it-IT')} VNĐ`:tag.value}</i></b>`
            break;
        case "less":
            return `<strong>${tag.name}</strong> less than <b><i>${tag.property==='price'?`${(tag.value*1000).toLocaleString('it-IT')} VNĐ`:tag.value}</i></b>`
            break;
        case "between":
            return `<strong>${tag.name}</strong> between <b><i>${tag.property==='price'?`${(tag.value.from*1000).toLocaleString('it-IT')} VNĐ`:tag.value.from}</i></b> and <b><i>${tag.property==='price'?`${(tag.value.to*1000).toLocaleString('it-IT')} VNĐ`:tag.value.to}</i></b>`
            break;
        case "date":
            return `<strong>${tag.name}</strong> from <b><i>${tag.value.start.toLocaleDateString('vi-VN')}</i></b> ${tag.value.end?` to <b><i>${tag.value.end.toLocaleDateString('vi-VN')}</i></b>`:''}`
            break;

    }
}

const filterType = {
    "text": (_)=> `
        <div class="form-check mb-1">
            <input class="form-check-input filter-radio-toggle" type="radio" name="${_.property}" id="${_.property}-radio-contain" data-action="contain" data-toggle='1'>
            <label class="form-check-label" for="${_.property}-radio-contain">contain</label>
        </div>
        <div class="form-group mb-1" id="1">
            <input readonly type="text" class="form-control form-control-sm value-input" data-name="${_.title}" data-filter="${_.property}" id="${_.property}-input-contain" placeholder="Text here">
        </div>
    `,
    "number" : (_) => `
        <!-- ${_.property} EQUAL TO -->
        <div class="form-check mb-1">
            <input class="form-check-input filter-radio-toggle" type="radio" name="${_.property}" id="${_.property}-radio-equal" data-action="equal" data-toggle='2'>
            <label class="form-check-label" for="${_.property}-radio-equal">equal to</label>
        </div>
        <div class="form-group mb-1 input-value"  id="2">
            <input readonly type="number" class="form-control form-control value-input" data-name="${_.title}" data-filter="${_.property}" id="${_.property}-input-equal" placeholder="Quantity here">
        </div>
        <!-- ${_.property} LESS THAN -->
        <div class="form-check mb-1">
            <input class="form-check-input filter-radio-toggle" type="radio" name="${_.property}" id="${_.property}-radio-less" data-action="less" data-toggle='3'>
            <label class="form-check-label" for="${_.property}-radio-less">less than</label>
        </div>
        <div class="form-group mb-1 input-value"  id="3">
            <input readonly type="number" class="form-control form-control value-input" data-name="${_.title}" data-filter="${_.property}" id="${_.property}-input-less" placeholder="Quantity here">
        </div>
        <!-- ${_.property} GREATER THAN -->
        <div class="form-check mb-1">
            <input class="form-check-input filter-radio-toggle" type="radio" name="${_.property}" id="${_.property}-radio-greater" data-action="greater" data-toggle='4'>
            <label class="form-check-label" for="${_.property}-radio-greater">greater than</label>
        </div>
        <div class="form-group mb-1 input-value"  id="4">
            <input readonly type="number" class="form-control form-control value-input" data-name="${_.title}" data-filter="${_.property}" id="${_.property}-input-greater" placeholder="Quantity here">
        </div>
        <!-- ${_.property} BETWEEN -->
        <div class="form-check mb-1">
            <input class="form-check-input filter-radio-toggle" type="radio" name="${_.property}" id="${_.property}-radio-between" data-action="between" data-toggle='5'>
            <label class="form-check-label" for="${_.property}-radio-between">between</label>
        </div>
        <div class="form-group row mb-1 input-value"  id="5">
            <label for="${_.property}-input-from" class="col-form-label col-sm-2">from</label>
            <input readonly type="number" class="form-control form-control-sm col-sm-4 value-input" data-name="${_.title}" data-filter="${_.property}" data-range="from" id="${_.property}-input-from" placeholder="Quantity here">
            <label for="${_.property}-input-to" class="col-form-label col-sm-2">to</label>
            <input readonly type="number" class="form-control form-control-sm col-sm-4 value-input" data-name="${_.title}" data-filter="${_.property}" data-range="to" id="${_.property}-input-to" placeholder="Quantity here">
        </div>`
    ,
    "category" : (_) => `
        <select name="simple" id="filter-${_.property}-select" class="LYAF-selecter" data-filter="${_.property}" data-name="${_.title}" data-placeholder="Select your option ..." multiple>
        </select>  `,
    "date" : (_) => `
      <!-- DAY -->
      <div class="form-check mb-1">
        <input class="form-check-input filter-radio-toggle" type="radio" name="date" id="date-radio" data-action="date" data-toggle='1'>
        <label class="form-check-label" for="date-radio">Day</label>
      </div>
      <div class="form-group mb-1 input-value"  id="1">
        <input readonly disabled type="date" id="my-date" name="start" min="2018-03" value="2018-05">
      </div>
      <!-- WEEK -->
      <div class="form-check mb-1">
        <input class="form-check-input filter-radio-toggle" type="radio" name="date" id="week-radio" data-action="date" data-toggle='2'>
        <label class="form-check-label" for="week-radio">Week</label>
      </div>
      <div class="form-group mb-1 input-value"  id="2">
        <input readonly disabled type="week" id="my-date" name="start" min="2018-03" value="2018-05">
      </div>
      <!-- MONTH -->
      <div class="form-check mb-1">
        <input class="form-check-input filter-radio-toggle" type="radio" name="date" id="month-radio" data-action="date" data-toggle='3'>
        <label class="form-check-label" for="month-radio">Month</label>
      </div>
      <div class="form-group mb-1 input-value"  id="3">
        <input readonly disabled type="month" id="my-date" name="start" min="2018-03" value="2018-05">
      </div>

    `
}

function getWeekDateRange(date){
  var startDate = moment(date.replace("-",'')).toDate()
  var endDate = moment(date.replace("-",'')).toDate()
  endDate.setDate(endDate.getDate() + 6)
  return {start: startDate, end: endDate}
}

function getMonthDateRange(year, month) {
  var startDate = moment([year, month - 1]);
  var endDate = moment(startDate).endOf('month');
  return { start: startDate, end: endDate };
}