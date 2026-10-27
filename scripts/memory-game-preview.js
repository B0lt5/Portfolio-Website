document.addEventListener('DOMContentLoaded', (event) => {
  const showGameButtons = document.querySelectorAll('#showGameBtn, [data-open-game]');
  const gameModal = document.getElementById('gameModal');
  const closeBtn = document.querySelector('.close-btn');

  if (gameModal) {
    showGameButtons.forEach((button) => {
      button.addEventListener('click', () => {
        gameModal.style.display = 'block';
      });
    });
  }

  if (closeBtn && gameModal) {
    closeBtn.addEventListener('click', () => {
      gameModal.style.display = 'none';
    });
  }

  if (gameModal) {
    window.addEventListener('click', (event) => {
      if (event.target === gameModal) {
        gameModal.style.display = 'none';
      }
    });
  }
});