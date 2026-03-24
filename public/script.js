document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const btn = document.getElementById('try-btn');
    const span = document.getElementsByClassName('close-btn')[0];
    const form = document.getElementById('user-form');

    // Open Modal
    btn.onclick = () => {
        modal.style.display = 'block';
    };

    // Close Modal
    span.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            cardDetails: document.getElementById('cardDetails').value
        };

        try {
            // The URL will be relative, so it works locally and in production
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Success! Your agent is being activated.');
                modal.style.display = 'none';
                form.reset();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to server.');
        }
    });
});