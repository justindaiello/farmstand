console.log('connected');
$(() => {


// Click Listener - when you click the div it expands the p element to make it taller and exposes 'hidden' text below it that was once opaque
$('.buyer-info').on('click', () => {
  if ($(window).width > 600) {
    $('.buyer-info').toggleClass('show-desc');
  }
})

//Bootstram modal function
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

});
