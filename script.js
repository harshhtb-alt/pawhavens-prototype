/* ===== PawHaven Pet Shop - JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // CATEGORY SOUND & EFFECTS
    // =============================
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const animalSounds = {
        Dogs: {
            label: 'Woof! 🐕',
            particles: ['🦴', '🐾', '❤️', '🎾', '🐕'],
            play() {
                // Bark: two short tones
                [0, 0.15].forEach(delay => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(250, audioCtx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + delay + 0.12);
                    gain.gain.setValueAtTime(0.3, audioCtx.currentTime + delay);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + 0.14);
                    osc.connect(gain).connect(audioCtx.destination);
                    osc.start(audioCtx.currentTime + delay);
                    osc.stop(audioCtx.currentTime + delay + 0.15);
                });
            }
        },
        Cats: {
            label: 'Meow! 🐈',
            particles: ['🐟', '🐾', '💕', '🧶', '🐈'],
            play() {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(500, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.15);
                osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
                osc.connect(gain).connect(audioCtx.destination);
                osc.start(); osc.stop(audioCtx.currentTime + 0.5);
            }
        },
        Birds: {
            label: 'Tweet! 🦜',
            particles: ['🪶', '🌿', '✨', '🎵', '🦜'],
            play() {
                [0, 0.12, 0.24].forEach((delay, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    const base = 1200 + i * 200;
                    osc.frequency.setValueAtTime(base, audioCtx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(base + 400, audioCtx.currentTime + delay + 0.06);
                    osc.frequency.exponentialRampToValueAtTime(base, audioCtx.currentTime + delay + 0.1);
                    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + 0.1);
                    osc.connect(gain).connect(audioCtx.destination);
                    osc.start(audioCtx.currentTime + delay);
                    osc.stop(audioCtx.currentTime + delay + 0.11);
                });
            }
        },
        Fish: {
            label: 'Blub! 🐠',
            particles: ['💧', '🫧', '🐚', '🌊', '🐠'],
            play() {
                [0, 0.1, 0.22].forEach(delay => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + delay + 0.08);
                    gain.gain.setValueAtTime(0.18, audioCtx.currentTime + delay);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + 0.1);
                    osc.connect(gain).connect(audioCtx.destination);
                    osc.start(audioCtx.currentTime + delay);
                    osc.stop(audioCtx.currentTime + delay + 0.11);
                });
            }
        },
        'Small Animals': {
            label: 'Squeak! 🐹',
            particles: ['🌻', '🥕', '💛', '🌾', '🐹'],
            play() {
                [0, 0.08].forEach(delay => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1800, audioCtx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(2400, audioCtx.currentTime + delay + 0.04);
                    osc.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + delay + 0.08);
                    gain.gain.setValueAtTime(0.12, audioCtx.currentTime + delay);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + 0.09);
                    osc.connect(gain).connect(audioCtx.destination);
                    osc.start(audioCtx.currentTime + delay);
                    osc.stop(audioCtx.currentTime + delay + 0.1);
                });
            }
        },
        Reptiles: {
            label: 'Hisss! 🦎',
            particles: ['🌿', '🍃', '🪨', '☀️', '🦎'],
            play() {
                const bufferSize = audioCtx.sampleRate * 0.4;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
                }
                const src = audioCtx.createBufferSource();
                src.buffer = buffer;
                const filter = audioCtx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 3000;
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
                src.connect(filter).connect(gain).connect(audioCtx.destination);
                src.start(); src.stop(audioCtx.currentTime + 0.4);
            }
        }
    };

    function spawnParticles(item, emojis) {
        const count = 8;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'category-particle';
            p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
            const dist = 50 + Math.random() * 40;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            p.style.setProperty('--particle-end', `translate(${x}px, ${y}px)`);
            p.style.top = '30%';
            p.style.left = '50%';
            p.style.fontSize = (0.9 + Math.random() * 0.6) + 'rem';
            p.style.animationDelay = (Math.random() * 0.15) + 's';
            item.appendChild(p);
            setTimeout(() => p.remove(), 1000);
        }
    }

    function showSoundLabel(item, text) {
        const label = document.createElement('span');
        label.className = 'category-sound-label';
        label.textContent = text;
        item.appendChild(label);
        setTimeout(() => label.remove(), 1100);
    }

    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Resume audio context on first user gesture
            if (audioCtx.state === 'suspended') audioCtx.resume();

            // Get category name
            const labelEl = item.querySelector('.category-label');
            const catName = labelEl ? labelEl.textContent.trim() : '';
            const sound = animalSounds[catName];

            // Remove previous animation
            item.classList.remove('clicked');
            void item.offsetWidth; // Force reflow
            item.classList.add('clicked');

            if (sound) {
                sound.play();
                spawnParticles(item, sound.particles);
                showSoundLabel(item, sound.label);
            }

            setTimeout(() => item.classList.remove('clicked'), 800);
        });
    });



    // =============================
    // PRODUCT DATA (used by cart)
    // =============================
    const productData = {
        '1': { name: 'NutriPaws Premium Dog Food', price: 899, img: 'images/product_dogfood.png' },
        '2': { name: 'ProGroom Deluxe Kit', price: 1299, img: 'images/product_groomingkit.png' },
        '3': { name: 'ToughChew Durable Bone', price: 449, img: 'images/product_chewtoy.png' },
        '4': { name: 'WhiskerPalace Cat Tree', price: 3499, img: 'images/product_cattree.png' },
        '5': { name: 'PurrFect Organic Cat Food', price: 749, img: 'images/product_dogfood.png' },
        '6': { name: 'SilkyCoat Shampoo Set', price: 599, img: 'images/product_groomingkit.png' },
    };

    // =============================
    // CART STATE
    // =============================
    let cart = JSON.parse(localStorage.getItem('pawhaven_cart') || '[]');

    function saveCart() {
        localStorage.setItem('pawhaven_cart', JSON.stringify(cart));
    }

    function addToCart(productId) {
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            const p = productData[productId];
            if (p) {
                cart.push({ id: productId, name: p.name, price: p.price, img: p.img, qty: 1 });
            }
        }
        saveCart();
        renderCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart();
    }

    function updateQty(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                removeFromCart(productId);
                return;
            }
        }
        saveCart();
        renderCart();
    }

    function renderCart() {
        const cartItemsEl = document.getElementById('cart-items');
        const cartEmptyEl = document.getElementById('cart-empty');
        const cartFooter = document.getElementById('cart-drawer-footer');
        const cartBadge = document.getElementById('cart-badge');
        const cartDrawerCount = document.getElementById('cart-drawer-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTotal = document.getElementById('cart-total');
        const freeShipMsg = document.getElementById('cart-free-shipping-msg');

        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const shipping = subtotal >= 499 ? 0 : 49;
        const total = subtotal + shipping;

        // Badge
        cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartBadge.classList.add('bump');
            setTimeout(() => cartBadge.classList.remove('bump'), 400);
        }

        // Count
        cartDrawerCount.textContent = `(${totalItems} item${totalItems !== 1 ? 's' : ''})`;

        // Empty state
        if (cart.length === 0) {
            cartEmptyEl.style.display = 'flex';
            cartItemsEl.innerHTML = '';
            cartFooter.style.display = 'none';
            return;
        }

        cartEmptyEl.style.display = 'none';
        cartFooter.style.display = 'block';

        // Render items
        cartItemsEl.innerHTML = cart.map((item, i) => `
            <div class="cart-item" style="animation-delay: ${i * 0.06}s">
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
                    <div class="cart-item-controls">
                        <button class="qty-btn" data-action="minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" data-action="plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        `).join('');

        // Summary
        cartSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        if (shipping === 0) {
            cartShipping.textContent = 'FREE';
            cartShipping.style.color = 'var(--sage-dark)';
            cartShipping.style.fontWeight = '800';
            freeShipMsg.style.display = 'flex';
        } else {
            cartShipping.textContent = `₹${shipping}`;
            cartShipping.style.color = '';
            cartShipping.style.fontWeight = '';
            freeShipMsg.style.display = 'none';
        }
        cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

        // Wire up qty & remove buttons
        cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                updateQty(id, action === 'plus' ? 1 : -1);
            });
        });

        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.dataset.id);
            });
        });

        // Update add-to-cart button states
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            const card = btn.closest('.product-card');
            if (!card) return;
            const pId = card.dataset.product;
            const inCart = cart.find(i => i.id === pId);
            if (inCart) {
                btn.classList.add('added');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    In Cart (${inCart.qty})
                `;
            } else {
                btn.classList.remove('added');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add to Cart
                `;
            }
        });
    }

    // =============================
    // CART DRAWER OPEN / CLOSE
    // =============================
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBtn = document.getElementById('cart-btn');
    const cartCloseBtn = document.getElementById('cart-drawer-close');
    const cartShopLink = document.getElementById('cart-shop-link');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('active');
        cartDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('active');
        cartDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    cartShopLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeCart();
        document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    cartCheckoutBtn.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('pawhaven_user') || 'null');
        if (!user) {
            closeCart();
            setTimeout(() => openAccountModal(), 300);
        } else {
            closeCart();
            window.location.href = 'checkout.html';
        }
    });

    // =============================
    // ADD TO CART BUTTONS
    // =============================
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            if (!card) return;
            const productId = card.dataset.product;
            addToCart(productId);

            // Open cart briefly to show the item
            openCart();
        });
    });

    // =============================
    // ACCOUNT MODAL
    // =============================
    const accountModal = document.getElementById('account-modal');
    const accountOverlay = document.getElementById('account-overlay');
    const accountBtn = document.getElementById('account-btn');
    const accountCloseBtn = document.getElementById('account-modal-close');
    const loginView = document.getElementById('account-login-view');
    const registerView = document.getElementById('account-register-view');
    const loggedinView = document.getElementById('account-loggedin-view');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const googleSigninBtn = document.getElementById('google-signin-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');

    function generatePawhavenId() {
        const num = Math.floor(100000 + Math.random() * 900000);
        return `PH-${num}`;
    }

    function openAccountModal() {
        const user = JSON.parse(localStorage.getItem('pawhaven_user') || 'null');
        if (user) {
            showLoggedInView(user);
        } else {
            loginView.style.display = 'block';
            registerView.style.display = 'none';
            loggedinView.style.display = 'none';
        }
        accountModal.classList.add('open');
        accountOverlay.classList.add('active');
        accountModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeAccountModal() {
        accountModal.classList.remove('open');
        accountOverlay.classList.remove('active');
        accountModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showLoggedInView(user) {
        loginView.style.display = 'none';
        registerView.style.display = 'none';
        loggedinView.style.display = 'block';

        document.getElementById('loggedin-name').textContent = `Welcome, ${user.name}!`;
        document.getElementById('loggedin-email').textContent = user.email;
        document.getElementById('user-pawhaven-id').textContent = user.pawhavenId;
        document.getElementById('account-avatar').textContent = user.name.charAt(0).toUpperCase();

        // Update nav button to show logged in
        accountBtn.innerHTML = `
            <span style="width:22px;height:22px;border-radius:50%;background:var(--sage);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:900;">${user.name.charAt(0).toUpperCase()}</span>
        `;
    }

    function loginUser(name, email) {
        let pawhavenId = generatePawhavenId();
        // Check if user exists in stored accounts
        const accounts = JSON.parse(localStorage.getItem('pawhaven_accounts') || '[]');
        const existing = accounts.find(a => a.email === email);
        if (existing) {
            pawhavenId = existing.pawhavenId;
            name = existing.name;
        }

        const user = { name, email, pawhavenId };
        localStorage.setItem('pawhaven_user', JSON.stringify(user));
        showLoggedInView(user);
    }

    accountBtn.addEventListener('click', openAccountModal);
    accountCloseBtn.addEventListener('click', closeAccountModal);
    accountOverlay.addEventListener('click', closeAccountModal);

    showRegisterBtn.addEventListener('click', () => {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
        loggedinView.style.display = 'none';
    });

    showLoginBtn.addEventListener('click', () => {
        loginView.style.display = 'block';
        registerView.style.display = 'none';
        loggedinView.style.display = 'none';
    });

    // Login form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) return;

        // Check stored accounts
        const accounts = JSON.parse(localStorage.getItem('pawhaven_accounts') || '[]');
        const account = accounts.find(a => a.email === email);

        if (account && account.password === password) {
            loginUser(account.name, account.email);
        } else if (account) {
            alert('❌ Incorrect password. Please try again.');
            return;
        } else {
            // Auto-create for demo
            const name = email.split('@')[0];
            const newAccount = { name, email, password, pawhavenId: generatePawhavenId() };
            accounts.push(newAccount);
            localStorage.setItem('pawhaven_accounts', JSON.stringify(accounts));
            loginUser(name, email);
        }

        loginForm.reset();
    });

    // Register form
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;

        if (!name || !email || !password) return;

        const accounts = JSON.parse(localStorage.getItem('pawhaven_accounts') || '[]');
        if (accounts.find(a => a.email === email)) {
            alert('An account with this email already exists. Please sign in instead.');
            showLoginBtn.click();
            return;
        }

        const pawhavenId = generatePawhavenId();
        const newAccount = { name, email, phone, password, pawhavenId };
        accounts.push(newAccount);
        localStorage.setItem('pawhaven_accounts', JSON.stringify(accounts));

        loginUser(name, email);
        registerForm.reset();

        alert(`🎉 Account created!\n\nYour PawHaven ID: ${pawhavenId}\n100 PawPoints credited!`);
    });

    // Google sign-in (simulated)
    function handleGoogleSignIn() {
        const names = ['Priya', 'Arjun', 'Meera', 'Rahul', 'Ananya', 'Karan'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const email = `${randomName.toLowerCase()}@gmail.com`;

        const accounts = JSON.parse(localStorage.getItem('pawhaven_accounts') || '[]');
        let account = accounts.find(a => a.email === email);
        if (!account) {
            account = { name: randomName, email, password: 'google', pawhavenId: generatePawhavenId(), isGoogle: true };
            accounts.push(account);
            localStorage.setItem('pawhaven_accounts', JSON.stringify(accounts));
        }

        loginUser(account.name, account.email);
    }

    googleSigninBtn.addEventListener('click', handleGoogleSignIn);
    googleSignupBtn.addEventListener('click', handleGoogleSignIn);

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('pawhaven_user');
        accountBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        closeAccountModal();
    });

    // Check if already logged in on load
    const existingUser = JSON.parse(localStorage.getItem('pawhaven_user') || 'null');
    if (existingUser) {
        showLoggedInView(existingUser);
    }

    // Initial cart render
    renderCart();

    // =============================
    // PAGE LOADER
    // =============================
    const loader = document.getElementById('page-loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 800);
    });
    setTimeout(() => loader.classList.add('hidden'), 2500);

    // =============================
    // STICKY NAVBAR
    // =============================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // =============================
    // MOBILE MENU
    // =============================
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // =============================
    // ACTIVE NAV ON SCROLL
    // =============================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => observerNav.observe(section));

    // =============================
    // PRODUCTS CAROUSEL
    // =============================
    const carousel = document.getElementById('products-carousel');
    const prevBtn = document.getElementById('products-prev');
    const nextBtn = document.getElementById('products-next');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 280;
        prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' }));

        // Drag scrolling
        let isDown = false, startX, scrollLeft;
        carousel.addEventListener('mousedown', (e) => { isDown = true; carousel.style.cursor = 'grabbing'; startX = e.pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft; });
        carousel.addEventListener('mouseleave', () => { isDown = false; carousel.style.cursor = 'grab'; });
        carousel.addEventListener('mouseup', () => { isDown = false; carousel.style.cursor = 'grab'; });
        carousel.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); carousel.scrollLeft = scrollLeft - ((e.pageX - carousel.offsetLeft) - startX) * 1.5; });
        carousel.style.cursor = 'grab';
    }

    // =============================
    // TESTIMONIALS CAROUSEL
    // =============================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        const prev = currentTestimonial;
        currentTestimonial = index;
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === index) card.classList.add('active');
            else if (i === prev) card.classList.add('prev');
        });
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-selected', i === index);
        });
    }

    function startTestimonialAutoplay() {
        testimonialInterval = setInterval(() => showTestimonial((currentTestimonial + 1) % testimonialCards.length), 5000);
    }

    testimonialDots.forEach(dot => {
        dot.addEventListener('click', () => {
            showTestimonial(parseInt(dot.dataset.dot));
            clearInterval(testimonialInterval);
            startTestimonialAutoplay();
        });
    });

    startTestimonialAutoplay();

    // =============================
    // SCROLL REVEAL
    // =============================
    const revealElements = [
        ...document.querySelectorAll('.trust-card'),
        ...document.querySelectorAll('.product-card'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.blog-card'),
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.section-subtitle'),
        ...document.querySelectorAll('.loyalty-content'),
        ...document.querySelectorAll('.categories-grid'),
    ];

    revealElements.forEach(el => el.classList.add('reveal'));

    const observerReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
                    entry.target.style.transitionDelay = `${siblings.indexOf(entry.target) * 0.1}s`;
                }
                entry.target.classList.add('visible');
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => observerReveal.observe(el));

    // =============================
    // FORMS (Loyalty & Newsletter)
    // =============================
    const loyaltyForm = document.getElementById('loyalty-form');
    if (loyaltyForm) {
        loyaltyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loyalty-email').value;
            if (email) {
                const btn = document.getElementById('loyalty-submit');
                btn.innerHTML = '🎉 Joined!';
                btn.style.background = 'var(--sage)';
                setTimeout(() => {
                    btn.innerHTML = `Join Free <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
                    btn.style.background = '';
                    document.getElementById('loyalty-email').value = '';
                }, 2500);
            }
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            if (email) {
                const btn = document.getElementById('newsletter-submit');
                btn.textContent = '✓ Subscribed!';
                setTimeout(() => { btn.textContent = 'Subscribe'; document.getElementById('newsletter-email').value = ''; }, 2500);
            }
        });
    }

    // =============================
    // CHAT BUBBLE
    // =============================
    const chatBubble = document.getElementById('chat-bubble');
    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            chatBubble.style.transform = 'scale(0.95)';
            setTimeout(() => {
                chatBubble.style.transform = '';
                alert('🐾 Chat feature coming soon! For now, call us at +91 98765 43210');
            }, 150);
        });
    }

    // =============================
    // SMOOTH SCROLL
    // =============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight, behavior: 'smooth' });
            }
        });
    });

    // =============================
    // HERO PARALLAX
    // =============================
    const heroImg = document.querySelector('.hero-image');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset < window.innerHeight) {
                heroImg.style.transform = `translateY(${window.pageYOffset * 0.15}px) scale(1.05)`;
            }
        }, { passive: true });
    }

    // ESC key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeAccountModal();
        }
    });

});
