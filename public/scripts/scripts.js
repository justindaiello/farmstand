console.log('connected');
$(() => {


// Click Listener - when you click the div it expands the p element to make it taller and exposes 'hidden' text below it that was once opaque
$('.buyer-info').on('click', () => {
  //disable click function when on a mobile device
  if (window.outerWidth >= 600) {
    $('.buyer-info').toggleClass('show-desc');
  } else {
    return;
  }
})

//Bootstrap modal function
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

});
