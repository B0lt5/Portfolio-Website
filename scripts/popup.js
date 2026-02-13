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
            e.preventDefault();

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !message) {
                alert('Please fill out all the required fields.');
                return;
            }

            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Disable button to prevent double submissions
            const sendBtn = document.getElementById('send-btn');
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending...';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showPopup();
                } else {
                    alert(data.error || 'Oops! There was a problem submitting your form. Please try again.');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('An error occurred. Please check your internet connection and try again.');
            } finally {
                // Re-enable the button regardless of outcome
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            }
        });
    }

    // Add event listener for the close button
    if (closePopupButton) {
        closePopupButton.addEventListener('click', closePopup);
    }
});