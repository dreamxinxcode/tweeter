// For the character counter
$(document).ready(function () {
  $('#tweet-text').on('keyup', function () {
    const $textLength = $(this).val().length;
    $('.counter').html(140 - $textLength);
    if (Number($('.counter').html()) < 0) {
      $('.counter').addClass('counter-red');
    } else {
      $('.counter').removeClass('counter-red');
    }
  });
});