function hidePulseEffect() {
  var pulseContainer = document.querySelector('.pulse-container');
  if (pulseContainer) {
    pulseContainer.style.opacity = '0';
    pulseContainer.style.transition = 'opacity 1s ease-out';
    setTimeout(function() { pulseContainer.style.display = 'none'; }, 1000);
  }
}
window.addEventListener('load', function() {
  setTimeout(function() {
    hidePulseEffect();
  }, 20000);
});
