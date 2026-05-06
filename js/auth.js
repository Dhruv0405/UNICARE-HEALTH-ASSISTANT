// Function to handle signup
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    try {
        // Use relative URL — works on any deployment
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Signup successful! Please login.');
            // Switch to login form
            if (typeof login === 'function') {
                login();
            }
        } else {
            alert('Signup failed: ' + (data?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please check your connection and try again.');
    }
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        // Use relative URL — works on any deployment
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Store the token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', data.user?.name || email.split('@')[0]);
            
            // Show loading animation
            const loadingAnimation = document.getElementById('loading-animation');
            if (loadingAnimation) {
                loadingAnimation.style.display = 'flex';
            }
            
            // Restore user data if available
            const savedCart = localStorage.getItem(`cart_${email}`);
            if (savedCart) {
                localStorage.setItem('cartItems', savedCart);
            }
            
            const savedAddresses = localStorage.getItem(`addresses_${email}`);
            if (savedAddresses) {
                localStorage.setItem('userAddresses', savedAddresses);
            }
            
            // Wait for 2 seconds before redirecting
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            alert('Login failed: ' + (data?.message || 'Invalid credentials'));
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please check your connection and try again.');
    }
}

// Function to handle logout
function handleLogout() {
    // Save user-specific data before clearing
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            localStorage.setItem(`cart_${userEmail}`, cartData);
        }
        const addressData = localStorage.getItem('userAddresses');
        if (addressData) {
            localStorage.setItem(`addresses_${userEmail}`, addressData);
        }
    }
    
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
    
    // Redirect to login
    window.location.href = '/login.html';
}

// Add event listeners to forms
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add logout event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
});