document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const popup = document.getElementById('popup');
    const closePopupButton = popup.querySelector('button'); // Select the close button inside the popup

    // Function to show the popup
    function showPopup() {
        popup.style.display = 'block';
    }

    // Function to close the popup
    function closePopup() {
        popup.style.display = 'none';
        form.reset(); // Reset the form when the popup closes
    }

    // Add event listener for form submission
    if (form) { // Check if the form element exists before adding listener
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex

            if (name && email && message && emailPattern.test(email)) {
                showPopup(); // Call the showPopup function
            } else if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Add event listener for the close button inside the popup
    if (closePopupButton) { // Check if the close button exists
        closePopupButton.addEventListener('click', closePopup);
    }
});

// Remove the extra curly brace at the end if it's there