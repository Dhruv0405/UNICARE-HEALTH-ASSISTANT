// Smooth scrolling functionality and other UI functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all links with the scroll-btn class
    const scrollLinks = document.querySelectorAll('.scroll-btn');
    
    // Add click event listener to each link
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to the target section
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Responsive Menu functionality
    const menuBtn = document.querySelector('#menubar');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('.header');
    
    // Add scroll event for fixed header
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('fixed-header');
            } else {
                header.classList.remove('fixed-header');
            }
        });
    }
    
    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
        });
    }
    
    // Close menu when clicking elsewhere
    if (navbar && menuBtn) {
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar') && !event.target.closest('#menubar')) {
                navbar.classList.remove('active');
            }
        });
    }
    
    // Login form functionality
    const loginBtn = document.querySelector('#loginbtn');
    const loginForm = document.querySelector('.login-form');
    const closeLoginForm = document.querySelector('#closeloginform');
    
    if (loginBtn && loginForm) {
        loginBtn.addEventListener('click', function() {
            loginForm.classList.add('active');
        });
    }
    
    if (closeLoginForm && loginForm) {
        closeLoginForm.addEventListener('click', function() {
            loginForm.classList.remove('active');
        });
    }
});

// Add smooth scrolling for Chat Us link
document.addEventListener('DOMContentLoaded', () => {
    const chatUsLink = document.querySelector('a[href="#contact-section"]');
    if (chatUsLink) {
        chatUsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Check if user is logged in and update UI accordingly
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const userProfile = document.getElementById('user-profile');
    const userInitial = document.getElementById('user-initial');

    if (token && userEmail) {
        // Hide login/signup buttons
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        
        // Show user profile with initial
        if (userProfile) {
            userProfile.style.display = 'flex';
            // Get first letter of name or email and make it uppercase
            const displayName = userName || userEmail;
            const initial = displayName.charAt(0).toUpperCase();
            if (userInitial) userInitial.textContent = initial;
        }
    } else {
        // Show login/signup buttons
        if (loginBtn) loginBtn.style.display = 'flex';
        if (signupBtn) signupBtn.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Call updateAuthUI when the page loads
document.addEventListener('DOMContentLoaded', updateAuthUI);

// Toggle dropdown menu when clicking on user initial
document.addEventListener('DOMContentLoaded', function() {
    const userInitialEl = document.getElementById('user-initial');
    const dropdownMenuEl = document.querySelector('.dropdown-menu');
    
    if (userInitialEl && dropdownMenuEl) {
        userInitialEl.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenuEl.classList.toggle('show');
            userInitialEl.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (dropdownMenuEl.classList.contains('show')) {
                dropdownMenuEl.classList.remove('show');
                userInitialEl.classList.remove('active');
            }
        });
    }

    // Handle logout button on all pages
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Save user-specific data before clearing
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const cartData = localStorage.getItem('cart');
                if (cartData) {
                    localStorage.setItem(`cart_${userEmail}`, cartData);
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
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // skip empty hashes
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});