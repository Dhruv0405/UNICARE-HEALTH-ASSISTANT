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
async function loadSavedAddresses() {
    const savedAddressesContainer = document.getElementById('saved-addresses');
    if (!savedAddressesContainer) return;
    
    // Clear container
    savedAddressesContainer.innerHTML = 'Loading addresses...';
    
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
    
    let userAddresses = [];
    try {
        const response = await fetch(`/api/addresses/${userEmail}`);
        if (response.ok) {
            userAddresses = await response.json();
            
            // Sync to local storage
            let allAddresses = {};
            const savedAddressesJSON = localStorage.getItem('allUserAddresses');
            if (savedAddressesJSON) {
                allAddresses = JSON.parse(savedAddressesJSON);
            }
            allAddresses[userEmail] = userAddresses;
            localStorage.setItem('allUserAddresses', JSON.stringify(allAddresses));
            localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
        }
    } catch (error) {
        console.error('Failed to load from DB, using localStorage fallback', error);
        // Get all addresses from local storage as fallback
        const allAddressesJSON = localStorage.getItem('allUserAddresses');
        if (allAddressesJSON) {
            const allAddresses = JSON.parse(allAddressesJSON);
            userAddresses = allAddresses[userEmail] || [];
        }
    }
    
    savedAddressesContainer.innerHTML = '';
    
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
        addressCard.className = `address-card-modern ${address.isDefault ? 'selected' : ''}`;
        addressCard.onclick = () => selectAddress(address.id);
        
        addressCard.innerHTML = `
            <div class="card-top">
                <span class="badge-modern ${address.nickname.toLowerCase()}">${address.nickname}</span>
                ${address.isDefault ? '<div class="select-indicator"><i class="fas fa-check-circle"></i></div>' : ''}
            </div>
            <div class="card-details">
                <h4>${address.fullName}</h4>
                <p>${address.fullAddress}</p>
                <div class="phone"><i class="fas fa-phone-alt"></i> ${address.mobileNumber}</div>
            </div>
            <div class="card-actions">
                <button class="edit" onclick="event.stopPropagation(); editAddress('${address.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete" onclick="event.stopPropagation(); deleteAddress('${address.id}')">
                    <i class="fas fa-trash"></i> Delete
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
async function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Check if user has a delivery address
    const savedAddresses = localStorage.getItem('userAddresses');
    const parsedAddresses = savedAddresses ? JSON.parse(savedAddresses) : [];
    if (parsedAddresses.length === 0) {
        if(typeof showAddressModal === 'function') {
            showAddressModal();
        }
        showNotification('Please add a delivery address to proceed');
        return;
    }
    
    showNotification('Proceeding to checkout...');
    
    // Get user details
    const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
    const defaultAddress = parsedAddresses.find(addr => addr.isDefault) || parsedAddresses[0];
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: userEmail,
                totalAmount: totalAmount,
                items: cart,
                shippingAddress: defaultAddress
            })
        });
        
        if (response.ok) {
            console.log('Order placed successfully, processing response...');
            const orderData = await response.json();
            console.log('Order data:', orderData);
            cart = [];
            saveCart();
            updateCartUI();
            toggleCart();
            
            // Show success modal
            const successModal = document.getElementById('order-success-modal');
            const orderIdSpan = document.getElementById('confirmed-order-id');
            console.log('Success modal found:', !!successModal);
            if (successModal && orderIdSpan) {
                orderIdSpan.textContent = `#${orderData.id}`;
                successModal.style.display = 'block';
                console.log('Success modal style.display set to block');
                
                // Track order button
                document.getElementById('track-order-btn').onclick = () => {
                    const mainView = document.getElementById('main-success-view');
                    const trackingView = document.getElementById('tracking-view');
                    const trackingOrderId = document.getElementById('tracking-order-id');
                    
                    if (mainView && trackingView) {
                        mainView.style.display = 'none';
                        trackingView.style.display = 'block';
                        if (trackingOrderId) trackingOrderId.textContent = `#${orderData.id}`;
                        
                        // Calculate dates
                        const now = new Date();
                        const tomorrow = new Date(now);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const dayAfter = new Date(now);
                        dayAfter.setDate(dayAfter.getDate() + 2);
                        
                        const formatOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                        const dateOptions = { month: 'short', day: 'numeric' };
                        
                        document.getElementById('date-placed').textContent = now.toLocaleString('en-IN', formatOptions);
                        document.getElementById('date-transit').textContent = `Expected by ${tomorrow.toLocaleString('en-IN', dateOptions)}`;
                        document.getElementById('date-delivered').textContent = `Estimated: ${dayAfter.toLocaleString('en-IN', dateOptions)}`;
                    }
                };
                
                // Back to success view button
                document.getElementById('back-to-success').onclick = () => {
                    const mainView = document.getElementById('main-success-view');
                    const trackingView = document.getElementById('tracking-view');
                    if (mainView && trackingView) {
                        mainView.style.display = 'block';
                        trackingView.style.display = 'none';
                    }
                };
                
                // Continue shopping button
                document.getElementById('continue-shopping-success').onclick = () => {
                    successModal.style.display = 'none';
                    // Reset to main view for next time
                    document.getElementById('main-success-view').style.display = 'block';
                    document.getElementById('tracking-view').style.display = 'none';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
            } else {
                showNotification('Order placed successfully!');
            }
        } else {
            const errData = await response.json();
            showNotification('Failed to place order: ' + (errData.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        showNotification('An error occurred. Please try again.');
    }
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
async function saveAddress(addressData) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        showNotification('Please log in to save addresses', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return false;
    }
    
    const form = document.getElementById('address-form');
    const editingId = form ? form.getAttribute('data-editing-id') : null;
    addressData.userEmail = userEmail;
    
    try {
        let response;
        if (editingId) {
            // Update existing address
            addressData.id = editingId;
            response = await fetch(`/api/addresses/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });
        } else {
            // Save new address
            response = await fetch('/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });
            if (response.ok) {
                const data = await response.json();
                addressData.id = data.id;
            }
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server error');
        }
    } catch (error) {
        console.error('Failed to sync with DB', error);
        showNotification(error.message, 'error');
        if (!addressData.id) addressData.id = Date.now().toString();
    }
    
    // Local storage sync
    let allAddresses = JSON.parse(localStorage.getItem('allUserAddresses') || '{}');
    if (!allAddresses[userEmail]) allAddresses[userEmail] = [];
    
    if (addressData.isDefault) {
        allAddresses[userEmail].forEach(addr => addr.isDefault = false);
    }
    
    if (editingId) {
        const index = allAddresses[userEmail].findIndex(addr => addr.id == editingId);
        if (index !== -1) allAddresses[userEmail][index] = addressData;
        form.removeAttribute('data-editing-id');
    } else {
        allAddresses[userEmail].push(addressData);
    }
    
    localStorage.setItem('allUserAddresses', JSON.stringify(allAddresses));
    localStorage.setItem('userAddresses', JSON.stringify(allAddresses[userEmail]));
    
    await loadSavedAddresses();
    showNotification(editingId ? 'Address updated successfully' : 'Address saved successfully', 'success');
    return true;
}

// Add this function to handle address selection
function selectAddress(addressId) {
    const userEmail = localStorage.getItem('userEmail');
    const allAddressesJSON = localStorage.getItem('allUserAddresses');
    
    if (allAddressesJSON && userEmail) {
        const allAddresses = JSON.parse(allAddressesJSON);
        const userAddresses = allAddresses[userEmail] || [];
        const selectedAddress = userAddresses.find(addr => addr.id == addressId);
        
        if (selectedAddress) {
            // Update the header address
            updateHeaderAddress(selectedAddress);
            
            // Highlight the selected card in UI
            document.querySelectorAll('.address-card-modern').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = Array.from(document.querySelectorAll('.address-card-modern')).find(card => 
                card.innerHTML.includes(selectedAddress.fullName) && card.innerHTML.includes(selectedAddress.mobileNumber)
            );
            if(selectedCard) selectedCard.classList.add('selected');
            
            // Close the modal
            const modal = document.getElementById('delivery-address-modal');
            if (modal) {
                // Wait a bit so user sees the selection
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
            
            // Show success notification
            showNotification('Delivery address updated successfully');
        }
    }
}

// Add this function to edit an address
function editAddress(addressId) {
    const userEmail = localStorage.getItem('userEmail');
    const allAddressesJSON = localStorage.getItem('allUserAddresses');
    
    if (allAddressesJSON && userEmail) {
        const allAddresses = JSON.parse(allAddressesJSON);
        const userAddresses = allAddresses[userEmail] || [];
        const address = userAddresses.find(addr => addr.id == addressId);
        
        if (address) {
            // Fill the form fields
            document.getElementById('full-name').value = address.fullName || '';
            document.getElementById('mobile-number').value = address.mobileNumber || '';
            document.getElementById('house-no').value = address.houseNo || '';
            document.getElementById('street').value = address.street || '';
            document.getElementById('landmark').value = address.landmark || '';
            document.getElementById('city').value = address.city || '';
            document.getElementById('state').value = address.state || '';
            document.getElementById('pincode').value = address.pincode || '';
            document.getElementById('default-address').checked = address.isDefault || false;
            
            // Store the ID being edited in a data attribute
            document.getElementById('address-form').setAttribute('data-editing-id', addressId);
            
            // Change button text
            document.getElementById('save-address').textContent = 'Update Address & Continue';
            
            // Scroll to form
            document.getElementById('address-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

async function deleteAddress(addressId) {
    const userEmail = localStorage.getItem('userEmail');
    
    if (userEmail) {
        try {
            await fetch(`/api/addresses/${addressId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Failed to delete from DB', error);
        }
        
        const allAddressesJSON = localStorage.getItem('allUserAddresses');
        if (allAddressesJSON) {
            const allAddresses = JSON.parse(allAddressesJSON);
            const userAddresses = allAddresses[userEmail] || [];
            
            // Find the address index
            const addressIndex = userAddresses.findIndex(addr => addr.id === addressId || addr.id === parseInt(addressId));
            
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
                await loadSavedAddresses();
                
                // Show success notification
                showNotification('Address deleted successfully');
            }
        }
    }
}