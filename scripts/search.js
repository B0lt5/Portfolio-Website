document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const blogGrid = document.querySelector('.blog-grid');
    const blogCards = blogGrid.querySelectorAll('.blog-card');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        blogCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});