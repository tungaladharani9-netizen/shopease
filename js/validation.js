// ========== VALIDATION.JS (Checkout Form Real-time Validation + Submission) ==========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    const fields = {
        fullName: { validate: val => /^[A-Za-z\s]{3,}$/.test(val), msg: 'Please enter your full name (letters only, min 3 characters)' },
        email: { validate: val => /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(val), msg: 'Please enter a valid email address' },
        phone: { validate: val => /^\d{10}$/.test(val), msg: 'Phone must be 10 digits' },
        address: { validate: val => val.length >= 10, msg: 'Please enter your full street address (min 10 characters)' },
        city: { validate: val => /^[A-Za-z\s]+$/.test(val), msg: 'Please enter a valid city name' },
        zip: { validate: val => /^\d{5,6}$/.test(val), msg: 'Please enter a valid postal code (5-6 digits)' },
        cardNumber: { validate: val => /^\d{16}$/.test(val), msg: 'Card number must be 16 digits' },
        expiry: { validate: val => {
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) return false;
            const [month, year] = val.split('/');
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month), 1);
            const now = new Date();
            return expiryDate > now;
        }, msg: 'Please enter a valid future expiry date (MM/YY)' },
        cvv: { validate: val => /^\d{3}$/.test(val), msg: 'CVV must be 3 digits' }
    };
    
    function validateField(fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return false;
        const value = input.value.trim();
        const rule = fields[fieldId];
        const isValid = rule ? rule.validate(value) : true;
        const errorSpan = document.getElementById(`${fieldId}-error`);
        if (isValid) {
            input.classList.add('valid-input');
            input.classList.remove('error-input');
            if (errorSpan) errorSpan.innerText = '';
        } else {
            input.classList.add('error-input');
            input.classList.remove('valid-input');
            if (errorSpan) errorSpan.innerText = rule.msg;
            if (!errorSpan) {
                const newSpan = document.createElement('span');
                newSpan.id = `${fieldId}-error`;
                newSpan.className = 'error-message';
                newSpan.innerText = rule.msg;
                input.parentNode.appendChild(newSpan);
            }
            addAnimationClass(input, 'shake-animation');
        }
        return isValid;
    }
    
    // attach real-time validation
    for (let key of Object.keys(fields)) {
        const inp = document.getElementById(key);
        if (inp) {
            inp.addEventListener('input', () => validateField(key));
            inp.addEventListener('blur', () => validateField(key));
        }
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isFormValid = true;
        for (let key of Object.keys(fields)) {
            if (!validateField(key)) isFormValid = false;
        }
        if (isFormValid && typeof clearCart === 'function') {
            clearCart();
            window.location.href = 'confirmation.html';
        } else {
            const firstError = document.querySelector('.error-input');
            if(firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});