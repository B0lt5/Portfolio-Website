document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const popup = document.getElementById('popup');
    const closePopupButton = popup.querySelector('button');

    // Function to show the popup
    function showPopup() {
        if (popup) {
            popup.style.display = 'block';
        }
    }

    // Function to close the popup and reset the form
    function closePopup() {
        if (popup) {
            popup.style.display = 'none';
        }
        if (form) {
            form.reset();
        }
    }

    // Add event listener for form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name && email && message && emailPattern.test(email)) {
                // If validation passes, proceed with sending the form
                const formData = new FormData(form);

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        showPopup(); // Show the popup on successful submission
                    } else {
                        // Handle potential server-side errors
                        alert('Oops! There was a problem submitting your form. Please try again.');
                    }
                } catch (error) {
                    // Handle network errors
                    console.error('Fetch error:', error);
                    alert('An error occurred. Please check your internet connection and try again.');
                }
            } else if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
            } else {
                alert('Please fill out all the required fields.');
            }
        });
    }

    // Add event listener for the close button
    if (closePopupButton) {
        closePopupButton.addEventListener('click', closePopup);
    }
});
