/* 
 * This is a simple jQuery implementation to support the website.
 * In a production environment, you would include the full jQuery library.
 */

// Define a simplified jQuery-like function
window.$ = function(selector) {
    const elements = document.querySelectorAll(selector);
    
    return {
        elements,
        
        on: function(event, callback) {
            elements.forEach(element => {
                element.addEventListener(event, callback);
            });
            return this;
        },
        
        addClass: function(className) {
            elements.forEach(element => {
                element.classList.add(className);
            });
            return this;
        },
        
        removeClass: function(className) {
            elements.forEach(element => {
                element.classList.remove(className);
            });
            return this;
        },
        
        toggleClass: function(className) {
            elements.forEach(element => {
                element.classList.toggle(className);
            });
            return this;
        },
        
        css: function(property, value) {
            elements.forEach(element => {
                element.style[property] = value;
            });
            return this;
        },
        
        html: function(content) {
            if (content === undefined) {
                return elements[0].innerHTML;
            }
            elements.forEach(element => {
                element.innerHTML = content;
            });
            return this;
        },
        
        text: function(content) {
            if (content === undefined) {
                return elements[0].textContent;
            }
            elements.forEach(element => {
                element.textContent = content;
            });
            return this;
        },
        
        show: function() {
            elements.forEach(element => {
                element.style.display = '';
            });
            return this;
        },
        
        hide: function() {
            elements.forEach(element => {
                element.style.display = 'none';
            });
            return this;
        }
    };
};

// Document ready function
$(document).ready = function(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}; 