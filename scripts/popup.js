document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const popup = document.getElementById('popup');
    const closePopupButton = popup ? popup.querySelector('button') : null; // Select the close button inside the popup

    // Function to show the popup
    function showPopup() {
        if (popup) {
            popup.style.display = 'block';
        }
    }
    
    // Function to close the popup
    function closePopup() {
        if (popup) {
            popup.style.display = 'none';
        }
        if (form) {
            form.reset(); // Reset the form when the popup closes
        }
    }

    // Add event listener for form submission
    if (form) { // Check if the form element exists before adding listener
        form.addEventListener('submit', function(e) {
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex

            if (!name || !email || !message || !emailPattern.test(email)) {
                e.preventDefault();
                alert('Please fill in all required fields and enter a valid email address.');
            }
        });
    }

    // Add event listener for the close button inside the popup
    if (closePopupButton) { // Check if the close button exists
        closePopupButton.addEventListener('click', closePopup);
    }
});

// Remove the extra curly brace at the end if it's there
