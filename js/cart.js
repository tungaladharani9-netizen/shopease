// ========== CART.JS (Cart Logic + LocalStorage + Badge + Totals) ==========
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('shopease_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
    updateCartCountDisplay();
    if (window.location.pathname.includes('cart.html')) renderCartPage();
    if (window.location.pathname.includes('checkout.html')) updateCheckoutSummary();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
    updateCartCountDisplay();
    if (window.location.pathname.includes('cart.html')) renderCartPage();
    if (window.location.pathname.includes('checkout.html')) updateCheckoutSummary();
    if (window.location.pathname.includes('products.html') && typeof renderProducts === 'function') renderProducts();
    if (window.location.pathname.includes('product-detail.html')) updateDetailCartStatus();
}

// Update navbar cart count badge with bounce animation
function updateCartCountDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        const oldCount = parseInt(badge.innerText);
        badge.innerText = totalItems;
        if (totalItems > oldCount && oldCount !== undefined) {
            addAnimationClass(badge, 'cart-badge-bounce');
        }
    }
    return totalItems;
}

// Add product to cart
function addToCart(productId, productName, productPrice, productImage) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            imageUrl: productImage
        });
    }
    saveCart();
    // Pulse animation on button that triggered add
    if (window.event && window.event.target) {
        const btn = window.event.target.closest('.add-to-cart');
        if (btn) addAnimationClass(btn, 'pulse-animation');
    }
}

// Update quantity (+/-)
function updateQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const newQty = cart[itemIndex].quantity + delta;
        if (newQty <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQty;
        }
        saveCart();
    }
}

// Remove item
function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Calculate totals
function getCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const grandTotal = subtotal + tax;
    return { subtotal, tax, grandTotal };
}

// Render Cart Page
function renderCartPage() {
    const cartContainer = document.getElementById('cart-items');
    const summaryContainer = document.getElementById('cart-summary');
    if (!cartContainer) return;
    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Your cart is empty.</p><a href="products.html" class="cta-button">Continue Shopping</a></div>`;
        if (summaryContainer) summaryContainer.innerHTML = '';
        return;
    }
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img">
                <div style="flex:2"><h4>${item.name}</h4><p>$${item.price.toFixed(2)}</p></div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <div><strong>$${(item.price * item.quantity).toFixed(2)}</strong></div>
                <button class="remove-btn" onclick="removeCartItem('${item.id}')">Delete</button>
            </div>
        `;
    });
    cartContainer.innerHTML = html;
    const { subtotal, tax, grandTotal } = getCartTotals();
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="summary">
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
                <p>Tax (10%): $${tax.toFixed(2)}</p>
                <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
                <a href="checkout.html" class="cta-button" style="margin-top:1rem;display:inline-block;">Proceed to Checkout</a>
            </div>
        `;
    }
}

// For checkout page display cart summary
function updateCheckoutSummary() {
    const summaryDiv = document.getElementById('checkout-cart-summary');
    if (summaryDiv) {
        const { subtotal, tax, grandTotal } = getCartTotals();
        summaryDiv.innerHTML = `<p>Subtotal: $${subtotal.toFixed(2)} | Tax: $${tax.toFixed(2)} | <strong>Total: $${grandTotal.toFixed(2)}</strong></p>`;
    }
}

// Clear cart after order
function clearCart() {
    cart = [];
    saveCart();
}

// Expose global functions
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeCartItem = removeCartItem;
window.loadCart = loadCart;
window.clearCart = clearCart;
window.updateCartCountDisplay = updateCartCountDisplay;

// Initialize cart on every page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    if (window.location.pathname.includes('cart.html')) renderCartPage();
    if (window.location.pathname.includes('checkout.html')) updateCheckoutSummary();
});