$(document).ready(function(){
	$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('.scrolltotop').fadeIn();
			} else {
				$('.scrolltotop').fadeOut();
			}
		});
		// scroll body to 0px on click
		$('.scrolltotop').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 400);
			return false;
		});
});