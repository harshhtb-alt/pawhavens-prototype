/* ===== PawHaven Checkout JS ===== */

document.addEventListener('DOMContentLoaded', () => {

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('pawhaven_cart') || '[]');
    const user = JSON.parse(localStorage.getItem('pawhaven_user') || 'null');

    // Product data fallback
    const productData = {
        '1': { name: 'NutriPaws Premium Dog Food', price: 899, img: 'images/product_dogfood.png' },
        '2': { name: 'ProGroom Deluxe Kit', price: 1299, img: 'images/product_groomingkit.png' },
        '3': { name: 'ToughChew Durable Bone', price: 449, img: 'images/product_chewtoy.png' },
        '4': { name: 'WhiskerPalace Cat Tree', price: 3499, img: 'images/product_cattree.png' },
        '5': { name: 'PurrFect Organic Cat Food', price: 749, img: 'images/product_dogfood.png' },
        '6': { name: 'SilkyCoat Shampoo Set', price: 599, img: 'images/product_groomingkit.png' },
    };

    // DOM Elements
    const stepCart = document.getElementById('step-cart');
    const stepPayment = document.getElementById('step-payment');
    const stepConfirm = document.getElementById('step-confirm');
    const steps = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');

    function getSubtotal() { return cart.reduce((s, i) => s + (i.price * i.qty), 0); }
    function getShipping() { return getSubtotal() >= 499 ? 0 : 49; }
    function getTotal() { return getSubtotal() + getShipping(); }
    function getTotalItems() { return cart.reduce((s, i) => s + i.qty, 0); }

    // ========== STEP 1: CART REVIEW ==========
    function renderCartReview() {
        const orderItemsEl = document.getElementById('order-items');
        const orderEmpty = document.getElementById('order-empty');

        if (cart.length === 0) {
            orderItemsEl.innerHTML = '';
            orderEmpty.style.display = 'block';
            document.getElementById('go-to-payment-btn').disabled = true;
            return;
        }

        orderEmpty.style.display = 'none';
        orderItemsEl.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-meta">₹${item.price.toLocaleString('en-IN')} × ${item.qty}</div>
                </div>
                <div class="order-item-right">
                    <div class="order-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
                    <div class="order-item-qty">Qty: ${item.qty}</div>
                    <button class="order-item-remove" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        // Remove buttons
        orderItemsEl.querySelectorAll('.order-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                cart = cart.filter(i => i.id !== btn.dataset.id);
                localStorage.setItem('pawhaven_cart', JSON.stringify(cart));
                renderCartReview();
                updateSummary();
            });
        });

        updateSummary();
    }

    function updateSummary() {
        const sub = getSubtotal();
        const ship = getShipping();
        const total = getTotal();
        const count = getTotalItems();

        document.getElementById('summary-items-count').textContent = `${count} item${count !== 1 ? 's' : ''}`;
        document.getElementById('summary-subtotal').textContent = `₹${sub.toLocaleString('en-IN')}`;

        const shipEl = document.getElementById('summary-shipping');
        const freeEl = document.getElementById('summary-free-ship');
        if (ship === 0) {
            shipEl.textContent = 'FREE';
            shipEl.style.color = 'var(--sage-dark)';
            shipEl.style.fontWeight = '800';
            freeEl.style.display = 'flex';
        } else {
            shipEl.textContent = `₹${ship}`;
            shipEl.style.color = '';
            shipEl.style.fontWeight = '';
            freeEl.style.display = 'none';
        }

        document.getElementById('summary-total').textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    // Pre-fill address if logged in
    if (user) {
        const nameInput = document.getElementById('addr-name');
        if (nameInput) nameInput.value = user.name || '';
    }

    renderCartReview();

    // ========== NAVIGATION ==========
    function goToStep(num) {
        stepCart.style.display = num === 1 ? 'block' : 'none';
        stepPayment.style.display = num === 2 ? 'block' : 'none';
        stepConfirm.style.display = num === 3 ? 'block' : 'none';

        steps.forEach((s, i) => {
            const stepNum = i + 1;
            s.classList.remove('active', 'done');
            if (stepNum < num) s.classList.add('done');
            else if (stepNum === num) s.classList.add('active');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Go to Payment
    document.getElementById('go-to-payment-btn').addEventListener('click', () => {
        if (cart.length === 0) return;
        goToStep(2);
        renderMiniOrder();
    });

    function renderMiniOrder() {
        const miniList = document.getElementById('mini-order-list');
        const count = getTotalItems();
        document.getElementById('payment-items-count').textContent = `${count} item${count !== 1 ? 's' : ''}`;
        document.getElementById('payment-total').textContent = `₹${getTotal().toLocaleString('en-IN')}`;

        miniList.innerHTML = cart.map(item => `
            <div class="mini-order-item">
                <div class="mini-item-img"><img src="${item.img}" alt="${item.name}"></div>
                <span class="mini-item-name">${item.name} ×${item.qty}</span>
                <span class="mini-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
        `).join('');
    }

    // ========== PAYMENT METHODS ==========
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('card-details-form');
    const giftForm = document.getElementById('gift-card-form');
    const payNowBtn = document.getElementById('pay-now-btn');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const val = radio.value;
            payNowBtn.disabled = false;

            // Show/hide card details
            cardForm.style.display = (val === 'visa' || val === 'mastercard') ? 'block' : 'none';
            giftForm.style.display = (val === 'giftcard') ? 'block' : 'none';

            // Update button text
            const methodNames = {
                gpay: 'Pay with Google Pay',
                phonepe: 'Pay with PhonePe',
                visa: 'Pay with Visa',
                mastercard: 'Pay with Mastercard',
                paypal: 'Pay with PayPal',
                giftcard: 'Redeem Gift Card',
            };
            payNowBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                ${methodNames[val] || 'Pay Now'}
            `;
        });
    });

    // Card number formatting
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 16);
            val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = val;
        });
    }

    // Expiry formatting
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2);
            e.target.value = val;
        });
    }

    // ========== PAY NOW ==========
    payNowBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="payment"]:checked');
        if (!selected) return;

        // Validate address
        const addrName = document.getElementById('addr-name').value.trim();
        const addrPhone = document.getElementById('addr-phone').value.trim();
        const addrLine = document.getElementById('addr-line').value.trim();

        if (!addrName || !addrPhone || !addrLine) {
            alert('📍 Please fill in your delivery address to continue.');
            document.getElementById('addr-name').focus();
            return;
        }

        // Show processing
        const overlay = document.getElementById('processing-overlay');
        overlay.classList.add('active');

        // Simulate payment processing
        setTimeout(() => {
            overlay.classList.remove('active');

            // Generate order ID
            const orderId = 'PH-ORD-' + Math.floor(100000 + Math.random() * 900000);

            // Payment method display name
            const methodNames = {
                gpay: 'Google Pay (UPI)',
                phonepe: 'PhonePe (UPI)',
                visa: 'Visa Card ****' + (document.getElementById('card-number')?.value.slice(-4) || '1234'),
                mastercard: 'Mastercard ****' + (document.getElementById('card-number')?.value.slice(-4) || '5678'),
                paypal: 'PayPal',
                giftcard: 'Gift Card',
            };

            // Fill confirmation
            document.getElementById('confirm-order-id').textContent = orderId;
            document.getElementById('confirm-payment-method').textContent = methodNames[selected.value] || selected.value;
            document.getElementById('confirm-amount').textContent = `₹${getTotal().toLocaleString('en-IN')}`;
            document.getElementById('confirm-points').textContent = Math.floor(getTotal() / 10);

            // Clear cart
            cart = [];
            localStorage.setItem('pawhaven_cart', JSON.stringify(cart));

            // Go to confirmation
            goToStep(3);

            // Spawn confetti
            spawnConfetti();

        }, 2500);
    });

    // Track order button
    document.getElementById('track-order-btn')?.addEventListener('click', () => {
        alert('📦 Order tracking will be available soon!\nYou\'ll receive updates via email & SMS.');
    });

    // ========== CONFETTI ==========
    function spawnConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        const colors = ['#FFD89B', '#FFB5C0', '#8AAE7F', '#7DBCE8', '#E5A84B', '#B5D4AC', '#F5CC7F'];

        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            piece.style.width = (6 + Math.random() * 8) + 'px';
            piece.style.height = (6 + Math.random() * 8) + 'px';
            if (Math.random() > 0.5) piece.style.borderRadius = '50%';
            container.appendChild(piece);
        }

        // Clean up after animation
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

});
