// ========== MAIN.JS (Shared Utilities, Nav, Animations) ==========
// Mobile Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Optional: toggle icon between bars and times
            const icon = hamburger.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    // Page fade-in handled by CSS class on body/main
    // Add cart count listener on all pages
    if (typeof window.updateCartCountDisplay === 'function') {
        window.updateCartCountDisplay();
    }
});

// Shared function to add animation class on element and remove after timeout
function addAnimationClass(element, className) {
    if (!element) return;
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 300);
}

// Generic function to show pulse animation on add-to-cart buttons
window.animateButton = function(btnElement) {
    addAnimationClass(btnElement, 'pulse-animation');
};