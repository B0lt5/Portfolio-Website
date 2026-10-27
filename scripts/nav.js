document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const hamburger = document.getElementById('hamburger');
  const headerLinks = document.getElementById('header-links');

  if (hamburger && headerLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      headerLinks.classList.toggle('nav-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Auto-update footer copyright year
  const footerText = document.querySelector('.footer p');
  if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace(/\b\d{4}\b/, new Date().getFullYear());
  }
});
