console.log('connected');
$(() => {


// Click Listener - when you click the div it expands the p element to make it taller and exposes 'hidden' text below it that was once opaque
$('.buyer-info').on('click', () => {
  $('.buyer-info').toggleClass('show-desc')
})
//Same as above except for the farmer information div
$('.farmer-info').on('click', () => {
  $('.farmer-info').toggleClass('show-desc')
})

});
