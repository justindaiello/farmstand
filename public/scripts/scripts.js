console.log('connected');
$(() => {


// Click Listener - when you click the div it expands the p element to make it taller and exposes 'hidden' text below it that was once opaque
$('.buyer-info').on('click', () => {
  $('.buyer-info').toggleClass('show-desc')
})


$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

});
