document.addEventListener('DOMContentLoaded', (event) => {
  const showGameBtn = document.getElementById('showGameBtn');
  const gameModal = document.getElementById('gameModal');
  const closeBtn = document.querySelector('.close-btn');

  // When the user clicks the button, open the modal
  if (showGameBtn) {
    showGameBtn.addEventListener('click', () => {
      gameModal.style.display = 'block';
    });
  }

  // When the user clicks on <span> (x), close the modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      gameModal.style.display = 'none';
    });
  }

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener('click', (event) => {
    if (event.target === gameModal) {
      gameModal.style.display = 'none';
    }
  });
});