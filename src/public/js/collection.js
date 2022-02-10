var G_star_id = 5
$(document).ready(()=>{
    var prePriceFrom = Number.parseFloat($("#price-from").val())
    var prePriceTo = Number.parseFloat($("#price-to").val())
    setStar(G_star_id)
    var slider = document.querySelector('.price-selecter');
    showLoading()
    fetch(window.location.origin + '/api/product/getMinMax')
    .then(data=>data.json())
    .then(data=>{
        const range = data[0]
        if (!prePriceFrom && !prePriceTo){
            prePriceFrom = range.minPrice
            prePriceTo = range.maxPrice
        }
        noUiSlider.create(slider, {
            start: [prePriceFrom, prePriceTo],
            tooltips: {to: function(val){
                return Math.floor(val).toLocaleString('it-IT') + ".000đ";
            }},
            range: {
                'min': range.minPrice,
                'max': range.maxPrice
            }
        });
        hideLoading()
    })

    $(".collection-search").click(()=>{ 
        const keyword = $(".LYAF-collection-filter #keyword").val()
        const isNew = $(".LYAF-collection-filter #condition-checkbox").is(':checked')
        const isSale = $(".LYAF-collection-filter #condition-checkbox2").is(':checked')
        const sort = $(".LYAF-sort-section select[name=sort] option:selected").val()
        const category = $(".LYAF-sort-section select[name=category] option:selected").val()
        const ratingAll = $("#rating-all").is(':checked')
        const price = slider.noUiSlider.get()
        const priceFrom = price[0]
        const priceTo = price[1]
        const rating = G_star_id
        window.location.href = window.location.origin + '/product/collection?' + new URLSearchParams({keyword, isNew, isSale, priceFrom, priceTo, rating, page: 1, sort, category, ratingAll})
    })
    $(".LYAF-collection-filter #rating span").click(function(){
        const id = this.dataset.id
        G_star_id = id
        console.log(G_star_id)
    })

    $(".LYAF-collection-filter #rating span").hover(function(){
        const id = this.dataset.id
        setStar(id)
    }, function(){
        setStar(G_star_id)
    })
})

function setStar(id){
    $(`.LYAF-collection-filter #rating span .fa-star`).remove()
    for (var i = 1; i <= 5 ; i++){
        $(`.LYAF-collection-filter #rating .star-${i}`).append(`
            <i class="${i<=id?'fas':''} fa-star fa-sm text-primary far start-${i}" title="" data-toggle="tooltip" data-original-title="${i}" data-id="${i}"></i>
        `)
    }
}

function priceFormat (price){
    var _price = price*1000
    _price = _price.toLocaleString('it-IT');
    return _price
}
function saleFormat (price, sale){
    var _price = price - sale * price
    _price = (_price*1000).toLocaleString('it-IT');
    return _price
}


function ratingStar (value){
    var rateStar = ''
    const val = value
    for (var i = 0; i < 5; i++) {
        if (val - i >= 1) {
            rateStar += '<span><i class="fas fa-star"></i></span>';
        } else if (val - i > 0 && val - i < 1) {
            rateStar +=  '<span><i class="fas fa-star-half-alt"></i></span>';
        } else {
            rateStar += '<span><i class="far fa-star"></i></span>';
        }
    }
    return rateStar
}