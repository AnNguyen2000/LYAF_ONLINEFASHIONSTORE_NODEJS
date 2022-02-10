
$(document).ready(()=>{
    var splide = new Splide( '.splide', {
        type   : 'fade',
        rewind: true,
        perPage : 1,
        autoplay: true,
      });
    splide.mount();

    $(".LYAF-body-block .tab-toggle").on('click', function(){
        var dataToggle = this.dataset.toggle;
        
        $(".tab-toggle").removeClass('active')
        $(this).addClass('active')

        $(".block-tab").addClass('d-none');
        $(`#tab-${dataToggle}`).removeClass('d-none');
    })
})
