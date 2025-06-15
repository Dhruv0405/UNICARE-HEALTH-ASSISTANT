// Menu bar functionality
let menubar = document.querySelector('#menubar');
let navbar = document.querySelector('.navbar');

menubar.onclick = () => {
    menubar.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

// Login form functionality
let login = document.querySelector('#loginbtn');
let loginform = document.querySelector('.login-form');
let closeloginform = document.querySelector('#closeloginform');

login.onclick = () => {
    loginform.classList.add('active');
}

closeloginform.onclick = () => {
    loginform.classList.remove('active');
}

// Slider functionality for trainers
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const leftBtn = document.querySelector('.left-arrow');
    const rightBtn = document.querySelector('.right-arrow');
    
    if (leftBtn && rightBtn) {
        leftBtn.addEventListener('click', () => changeSlide('left'));
        rightBtn.addEventListener('click', () => changeSlide('right'));
    }
    
    function changeSlide(direction) {
        const slideClasses = ['slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5'];
        
        if (direction === 'left') {
            slideClasses.push(slideClasses.shift());
        } else {
            slideClasses.unshift(slideClasses.pop());
        }
        
        slides.forEach((slide, idx) => {
            slide.className = `slide ${slideClasses[idx]}`;
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        
        // Close navbar if it's open (mobile)
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menubar.classList.remove('fa-times');
        }
    });
}); 