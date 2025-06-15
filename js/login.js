document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded in login.js');
    
    const x = document.getElementById("login-form");
    const y = document.getElementById("signup-form");
    const z = document.getElementById("btn");
    
    if (!x) console.error('login-form not found!');
    if (!y) console.error('signup-form not found!');
    if (!z) console.error('btn not found!');
    
    // Set initial positions
    if (x && y && z) {
        console.log('All form elements found, setting initial positions');
        x.style.left = "50px";
        y.style.left = "450px";
        z.style.left = "0";
    }
    
    // Make these functions global
    window.register = function() {
        console.log('Register function called');
        if (x && y && z) {
            x.style.left = "-400px";
            y.style.left = "50px";
            z.style.left = "110px";
        }
    };
    
    window.login = function() {
        console.log('Login function called');
        if (x && y && z) {
            x.style.left = "50px";
            y.style.left = "450px";
            z.style.left = "0";
        }
    };
});

function signInWithGoogle() {
    // This is where you'll implement Google Sign-In
    console.log('Google Sign-In clicked');
    alert('Google Sign-In is not yet implemented');
    // You'll need to:
    // 1. Add Google Sign-In API script to login.html
    // 2. Configure Google OAuth credentials
    // 3. Implement the actual sign-in flow
}