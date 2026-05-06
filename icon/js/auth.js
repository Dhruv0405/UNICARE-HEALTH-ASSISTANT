// Function to handle signup
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    console.log('Signup form submitted with:', { name, email, password: '***' });
    
    try {
        console.log('Attempting to connect to server at /api/signup');
        // Change this line to use the correct port (3002 instead of 3001)
        const response = await fetch('http://localhost:3002/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        console.log('Server response status:', response.status);
        
        // Check if response is empty
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        let data;
        if (responseText && responseText.trim() !== '') {
            try {
                data = JSON.parse(responseText);
                console.log('Parsed response data:', data);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                throw new Error('Invalid response from server: ' + responseText);
            }
        } else {
            console.error('Empty response received from server');
            throw new Error('Server returned an empty response');
        }
        
        if (response.ok) {
            alert('Signup successful! Please login.');
            window.location.href = '/login.html';
        } else {
            alert('Signup failed: ' + (data?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        alert('An error occurred during signup: ' + error.message);
    }
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Add debug logging
    console.log('Login form submitted with:', { email, password: '***' });

    try {
        console.log('Attempting to connect to server at /api/login');
        // Also update this line to use port 3002
        const response = await fetch('http://localhost:3002/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Server response status:', response.status);
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        let data;
        if (responseText && responseText.trim() !== '') {
            data = JSON.parse(responseText);
            console.log('Server response data:', data);
        } else {
            throw new Error('Empty response from server');
        }
        
        // In the handleLogin function, after successful login
        if (response.ok) {
        // Store the token
        localStorage.setItem('token', data.token);
        // Store user email for display
        localStorage.setItem('userEmail', email);
        
        // Show loading animation
        const loadingAnimation = document.getElementById('loading-animation');
        loadingAnimation.style.display = 'flex';
        
        // Restore user data if available
        const savedCart = localStorage.getItem(`cart_${email}`);
        if (savedCart) {
            localStorage.setItem('cartItems', savedCart);
        }
        
        const savedAddresses = localStorage.getItem(`addresses_${email}`);
        if (savedAddresses) {
            localStorage.setItem('userAddresses', savedAddresses);
        }
        
        // Wait for 2.5 seconds before redirecting
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2500);
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error details:', error);
        alert('An error occurred during login: ' + error.message);
    }
}

// Add event listeners to forms
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up form listeners');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    if (signupForm) {
        console.log('Signup form found, adding event listener');
        signupForm.addEventListener('submit', handleSignup);
    } else {
        console.error('Signup form not found!');
    }
    
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form not found!');
    }
});