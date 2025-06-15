// Add this new function to update the header address
function updateHeaderAddress(address) {
    const headerAddress = document.getElementById('header-address');
    if (headerAddress) {
        // Check if address exists and has fullAddress property
        if (address && typeof address === 'object') {
            const displayAddress = address.fullAddress || 'No address selected';
            headerAddress.textContent = displayAddress.length > 30 ? 
                displayAddress.substring(0, 30) + '...' : 
                displayAddress;
        } else if (typeof address === 'string') {
            headerAddress.textContent = address.length > 30 ? 
                address.substring(0, 30) + '...' : 
                address;
        } else {
            headerAddress.textContent = 'No address selected';
        }
    }
}

// Modify the loadSavedAddresses function to load addresses for the current user
function loadSavedAddresses() {
    const savedAddressesContainer = document.getElementById('saved-addresses');
    if (!savedAddressesContainer) return;
    
    // Clear container
    savedAddressesContainer.innerHTML = '';
    
    // Get current user email
    const userEmail = localStorage.getItem('userEmail');
    
    // If no user is logged in, show message
    if (!userEmail) {
        savedAddressesContainer.innerHTML = `
            <div class="no-addresses">
                <p>Please log in to manage your addresses.</p>
                <a href="login.html" class="login-prompt-btn">Login</a>
            </div>
        `;
        return;
    }
    
    // Get all addresses
    const allAddressesJSON = localStorage.getItem('allUserAddresses');
    let userAddresses = [];
    
    if (allAddressesJSON) {
        const allAddresses = JSON.parse(allAddressesJSON);
        userAddresses = allAddresses[userEmail] || [];
        
        // Also update the legacy storage for compatibility
        localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
    }
    
    if (userAddresses.length === 0) {
        // No saved addresses
        savedAddressesContainer.innerHTML = `
            <div class="no-addresses">
                <p>No saved addresses found. Add a new address to continue.</p>
            </div>
        `;
        return;
    }
    
    // Add each address to the container
    userAddresses.forEach(address => {
        const addressCard = document.createElement('div');
        addressCard.className = `saved-address-card ${address.isDefault ? 'default' : ''}`;
        addressCard.innerHTML = `
            <div class="address-info">
                <div class="address-type">${address.nickname} ${address.isDefault ? '(Default)' : ''}</div>
                <div class="address-text">${address.fullAddress}</div>
            </div>
            <div class="address-actions">
                <button class="use-address-btn" onclick="selectAddress('${address.id}')">
                    <i class="fas fa-check-circle"></i> Use
                </button>
                <button class="edit-address-btn" onclick="editAddress('${address.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-address-btn" onclick="deleteAddress('${address.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        savedAddressesContainer.appendChild(addressCard);
    });
    
    // If we have a default address, update the header
    const defaultAddress = userAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
        updateHeaderAddress(defaultAddress);
    }
}

// Cart functionality
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage if available
    loadCart();
    
    // Add event listeners to all Add to Cart buttons
    initializeAddToCartButtons();
    
    // Add event listener to cart button
    document.getElementById('cart-btn').addEventListener('click', toggleCart);
    
    // Add event listener to close cart button
    document.getElementById('close-cart').addEventListener('click', toggleCart);
    
    // Add event listener to checkout button
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    
    // Load saved addresses
    loadSavedAddresses();
});

// Initialize Add to Cart buttons
function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productCard = event.target.closest('.product-card');
            if (productCard) {
                addToCart(productCard);
            }
        });
    });
}

// Add product to cart
// Modify the addToCart function to add animation to the cart button
function addToCart(productCard) {
    // Get product details
    const productTitle = productCard.querySelector('.product-title').textContent;
    const productImage = productCard.querySelector('.product-image').src;
    const productPrice = parseFloat(productCard.querySelector('.discounted-price').textContent.replace('₹', ''));
    const originalPrice = parseFloat(productCard.querySelector('.original-price').textContent.replace('₹', ''));
    const productDescription = productCard.querySelector('.product-description').textContent;
    
    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.title === productTitle);
    
    if (existingProductIndex !== -1) {
        // Product already in cart, increase quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            title: productTitle,
            image: productImage,
            price: productPrice,
            originalPrice: originalPrice,
            description: productDescription,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
    
    // Add animation to cart button
    const fixedCartBtn = document.getElementById('fixed-cart-btn');
    fixedCartBtn.classList.add('cart-bump');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        fixedCartBtn.classList.remove('cart-bump');
    }, 300);
    
    // Show success message
    showNotification(`${productTitle} added to cart!`);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button id="continue-shopping" onclick="toggleCart()">Continue Shopping</button>
            </div>
        `;
    } else {
        // Add each item to cart
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="cart-item-price">
                        <span class="item-price">₹${item.price.toFixed(2)}</span>
                        <span class="item-original-price">₹${item.originalPrice.toFixed(2)}</span>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }
    
    // Update cart total
    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalSavings = cart.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
    
    document.getElementById('cart-total-amount').textContent = `₹${totalAmount.toFixed(2)}`;
    document.getElementById('total-savings').textContent = totalSavings.toFixed(2);
}

// Decrease item quantity
function decreaseQuantity(event) {
    const index = event.target.dataset.index;
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCartUI();
}

// Increase item quantity
function increaseQuantity(event) {
    const index = event.target.dataset.index;
    cart[index].quantity += 1;
    
    saveCart();
    updateCartUI();
}

// Remove item from cart
function removeItem(event) {
    const index = event.target.closest('.remove-item').dataset.index;
    cart.splice(index, 1);
    
    saveCart();
    updateCartUI();
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Check if user has a delivery address
    const savedAddresses = localStorage.getItem('userAddresses');
    if (!savedAddresses || JSON.parse(savedAddresses).length === 0) {
        showAddressModal();
        showNotification('Please add a delivery address to proceed');
        return;
    }
    
    // Proceed with checkout (this would typically redirect to a checkout page)
    showNotification('Proceeding to checkout...');
    // For demo purposes, we'll just clear the cart
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        toggleCart();
        showNotification('Order placed successfully!');
    }, 2000);
}

// Show notification
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const productsContainer = document.querySelector('.products-container');

    function searchProducts(query) {
        query = query.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-card');
        let foundProducts = false;

        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();

            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
                card.classList.add('highlight-product');
                foundProducts = true;
            } else {
                card.style.display = 'none';
                card.classList.remove('highlight-product');
            }
        });

        if (foundProducts) {
            const firstMatch = document.querySelector('.highlight-product');
            if (firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return foundProducts;
    }

    // Search on button click
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            const found = searchProducts(query);
            if (!found) {
                alert('No products found matching your search.');
            }
        }
    });

    // Search on Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query) {
                const found = searchProducts(query);
                if (!found) {
                    alert('No products found matching your search.');
                }
            }
        }
    });

    // Clear search results when input is cleared
    searchInput.addEventListener('input', () => {
        if (!searchInput.value) {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('highlight-product');
            });
        }
    });
});

// Add this function to save an address
function saveAddress(addressData) {
    // Get the current user email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    
    // If no user is logged in, show login prompt
    if (!userEmail) {
        showNotification('Please log in to save addresses', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Generate a unique ID for the address
    addressData.id = Date.now().toString();
    
    // Add user identifier to the address
    addressData.userEmail = userEmail;
    
    // Get all saved addresses
    let allAddresses = {};
    const savedAddressesJSON = localStorage.getItem('allUserAddresses');
    if (savedAddressesJSON) {
        allAddresses = JSON.parse(savedAddressesJSON);
    }
    
    // Initialize user's addresses array if it doesn't exist
    if (!allAddresses[userEmail]) {
        allAddresses[userEmail] = [];
    }
    
    // If this is set as default, update other addresses
    if (addressData.isDefault) {
        allAddresses[userEmail].forEach(addr => {
            addr.isDefault = false;
        });
    }
    
    // Add the new address
    allAddresses[userEmail].push(addressData);
    
    // Save all addresses back to localStorage
    localStorage.setItem('allUserAddresses', JSON.stringify(allAddresses));
    
    // Also save to the current user's addresses for backward compatibility
    localStorage.setItem('userAddresses', JSON.stringify(allAddresses[userEmail]));
    
    // Update the UI
    loadSavedAddresses();
    showNotification('Address saved successfully', 'success');
}

// Add this function to handle address selection
function selectAddress(addressId) {
    const userEmail = localStorage.getItem('userEmail');
    const allAddressesJSON = localStorage.getItem('allUserAddresses');
    
    if (allAddressesJSON && userEmail) {
        const allAddresses = JSON.parse(allAddressesJSON);
        const userAddresses = allAddresses[userEmail] || [];
        const selectedAddress = userAddresses.find(addr => addr.id === addressId);
        
        if (selectedAddress) {
            // Update the header address
            updateHeaderAddress(selectedAddress);
            
            // Close the modal
            const modal = document.getElementById('delivery-address-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Show success notification
            showNotification('Delivery address updated successfully');
        }
    }
}

function deleteAddress(addressId) {
    const userEmail = localStorage.getItem('userEmail');
    const allAddressesJSON = localStorage.getItem('allUserAddresses');
    
    if (allAddressesJSON && userEmail) {
        const allAddresses = JSON.parse(allAddressesJSON);
        const userAddresses = allAddresses[userEmail] || [];
        
        // Find the address index
        const addressIndex = userAddresses.findIndex(addr => addr.id === addressId);
        
        if (addressIndex !== -1) {
            // Check if we're deleting the default address
            const isDefault = userAddresses[addressIndex].isDefault;
            
            // Remove the address
            userAddresses.splice(addressIndex, 1);
            
            // If we deleted the default address and have other addresses, make the first one default
            if (isDefault && userAddresses.length > 0) {
                userAddresses[0].isDefault = true;
                updateHeaderAddress(userAddresses[0]);
            } else if (userAddresses.length === 0) {
                updateHeaderAddress('No address selected');
            }
            
            // Update the addresses in localStorage
            allAddresses[userEmail] = userAddresses;
            localStorage.setItem('allUserAddresses', JSON.stringify(allAddresses));
            
            // Update legacy storage for compatibility
            localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
            
            // Refresh the addresses display
            loadSavedAddresses();
            
            // Show success notification
            showNotification('Address deleted successfully');
        }
    }
}