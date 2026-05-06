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
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('fixed-header');
        } else {
            header.classList.remove('fixed-header');
        }
    });
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
        });
    }
    
    // Close menu when clicking elsewhere
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && !event.target.closest('#menubar')) {
            navbar.classList.remove('active');
        }
    });
    
    // Login form functionality
    const loginBtn = document.querySelector('#loginbtn');
    const loginForm = document.querySelector('.login-form');
    const closeLoginForm = document.querySelector('#closeloginform');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginForm.classList.add('active');
        });
    }
    
    if (closeLoginForm) {
        closeLoginForm.addEventListener('click', function() {
            loginForm.classList.remove('active');
        });
    }
});

// Firebase configuration
const firebaseConfig = { 
    apiKey: "AIzaSyDSn7gAerRygV_9Rw_E25pq5Z9jI6Jl8Zc", 
    authDomain: "chat-a5f2f.firebaseapp.com", 
    projectId: "chat-a5f2f", 
    storageBucket: "chat-a5f2f.firebasestorage.app", 
    messagingSenderId: "515521975505", 
    appId: "1:515521975505:web:82c6155580b0e5be70e1f0", 
    measurementId: "G-DZJ49X3KHN" 
};

// Initialize Firebase and set up contact form when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Get a reference to the database service
    window.database = firebase.database();
    
    // IMPORTANT: Initialize contact form AFTER Firebase is initialized
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const timestamp = new Date().toISOString();
            
            // Save to Firebase
            const newMessageRef = database.ref('messages').push();
            newMessageRef.set({
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: timestamp,
                read: false
            })
            .then(function() {
                formStatus.textContent = 'Your message has been sent successfully!';
                formStatus.className = 'form-status success';
                contactForm.reset();
                console.log('Message sent successfully to Firebase!');
            })
            .catch(function(error) {
                console.error('Error saving message: ', error);
                formStatus.textContent = 'Failed to send message. Please try again later.';
                formStatus.className = 'form-status error';
            })
            .finally(function() {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Show status message
                formStatus.style.display = 'block';
                
                // Hide status message after 5 seconds
                setTimeout(function() {
                    formStatus.style.display = 'none';
                }, 5000);
            });
        });
    }
});

// Swiper initialization
document.addEventListener('DOMContentLoaded', function() {
    /*-services--*/
    var swiper = new Swiper(".mySwiperservices", {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          700: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        },
    });
    
    /*--team--*/
    var swiper = new Swiper(".mySwiperteam", {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          560: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          950: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1250: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        },
    });
    
    /*--testimonials--*/
    var swiper = new Swiper(".mySwipertesti", {
        pagination: {
          el: ".swiper-pagination",
        },
    });
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
            // Get first letter of email and make it uppercase
            const initial = userEmail.charAt(0).toUpperCase();
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
const userInitial = document.getElementById('user-initial');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (userInitial) {
    userInitial.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
        userInitial.classList.toggle('active');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (dropdownMenu && dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
        userInitial.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});