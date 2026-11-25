/* ==========================================================================
   AJMAN LUXURY — Exact 3saf.com Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTransparentHeaderScroll();
    initMobileDrawer();
    initSearchDropBar();
    initCartDrawer();
    initAddToCartButtons();
    initScrollToTop();
});

/* 1. Header Transparent -> Dark Glass on Scroll (3saf Style) */
function initTransparentHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* 2. Mobile Drawer Navigation */
function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobileMenuBtn');
    const drawerOverlay = document.getElementById('mobileDrawerOverlay');
    const closeBtn = document.getElementById('closeDrawerBtn');

    if (toggleBtn && drawerOverlay) {
        toggleBtn.addEventListener('click', () => {
            drawerOverlay.classList.add('active');
        });
    }

    if (closeBtn && drawerOverlay) {
        closeBtn.addEventListener('click', () => {
            drawerOverlay.classList.remove('active');
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) {
                drawerOverlay.classList.remove('active');
            }
        });
    }
}

/* 3. Search Drop Bar */
function initSearchDropBar() {
    const triggerBtn = document.getElementById('searchTriggerBtn');
    const dropBar = document.getElementById('searchDropBar');
    const closeBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');

    if (triggerBtn && dropBar) {
        triggerBtn.addEventListener('click', () => {
            dropBar.classList.toggle('active');
            if (dropBar.classList.contains('active') && searchInput) {
                searchInput.focus();
            }
        });
    }

    if (closeBtn && dropBar) {
        closeBtn.addEventListener('click', () => {
            dropBar.classList.remove('active');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.product-card-3saf').forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const notes = card.querySelector('.product-notes-snippet').textContent.toLowerCase();
                if (title.includes(query) || notes.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/* 4. Cart Storage & Drawer Handling */
const CART_STORAGE_KEY = 'ajman_luxury_3saf_cart_v4';

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cart = readCart();
    const countNodes = document.querySelectorAll('[data-cart-count]');
    const headerCount = document.getElementById('cartHeaderCount');
    const itemsContainer = document.getElementById('cartItemsContainer');
    const subtotalNode = document.getElementById('cartDrawerSubtotal');

    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countNodes.forEach(node => node.textContent = totalQty);
    if (headerCount) headerCount.textContent = totalQty;

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: #888;">
                <i class="fas fa-bag-shopping" style="font-size: 3rem; margin-bottom: 1rem; color: #ddd;"></i>
                <p style="font-size: 1.1rem; font-weight: 700;">سلة المشتريات فارغة</p>
                <p style="font-size: 0.9rem; margin-top: 0.4rem;">اختر أحد عطور النيش الفاخرة لتجربتها مع عينة مجانية.</p>
            </div>
        `;
        if (subtotalNode) subtotalNode.textContent = '0 د.إ';
        return;
    }

    let subtotal = 0;
    itemsContainer.innerHTML = cart.map((item, index) => {
        const priceNum = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 380;
        subtotal += priceNum * item.quantity;
        return `
            <div class="cart-item-row">
                <img src="${item.image || '/images/products/president.png'}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">${priceNum * item.quantity} د.إ</div>
                    <div class="cart-qty-ctrl">
                        <button class="qty-btn" onclick="changeCartQty(${index}, -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeCartQty(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="removeCartItem(${index})" title="حذف">
                    <i class="fas fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');

    if (subtotalNode) subtotalNode.textContent = `${subtotal} د.إ`;
}

window.changeCartQty = function(index, delta) {
    const cart = readCart();
    if (!cart[index]) return;
    cart[index].quantity = (cart[index].quantity || 1) + delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
};

window.removeCartItem = function(index) {
    const cart = readCart();
    cart.splice(index, 1);
    saveCart(cart);
};

function initCartDrawer() {
    const toggleBtn = document.getElementById('cartToggleBtn');
    const bottomCartBtn = document.getElementById('mobileBottomCartBtn');
    const overlay = document.getElementById('cartOverlay');
    const closeBtn = document.getElementById('closeCartBtn');

    const openCart = () => {
        if (overlay) overlay.classList.add('active');
    };

    const closeCart = () => {
        if (overlay) overlay.classList.remove('active');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openCart);
    if (bottomCartBtn) bottomCartBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeCart();
        });
    }

    const waCheckoutBtn = document.getElementById('cartWhatsappCheckoutBtn');
    if (waCheckoutBtn) {
        waCheckoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sendCartToWhatsApp();
        });
    }

    updateCartUI();
}

/* 5. Add to Cart Handling */
function initAddToCartButtons() {
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.productId;
            const name = btn.dataset.productName;
            const price = btn.dataset.productPrice;
            const image = btn.dataset.productImage;

            const cart = readCart();
            const existing = cart.find(item => item.id === id);

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }

            saveCart(cart);

            const overlay = document.getElementById('cartOverlay');
            if (overlay) overlay.classList.add('active');
        });
    });
}

/* 6. Floating Scroll to Top (3saf Arrow) */
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* 7. WhatsApp Direct Checkout Engine */
const WA_PHONE = '971561634196';

function sendCartToWhatsApp() {
    const cart = readCart();
    const isAr = document.documentElement.lang !== 'en';
    
    if (!cart || cart.length === 0) {
        alert(isAr ? 'سلة المشتريات فارغة، يرجى اختيار عطر أولاً.' : 'Your bag is empty, please choose a perfume first.');
        return;
    }

    let total = 0;
    let itemsText = '';

    cart.forEach((item) => {
        const qty = item.quantity || 1;
        const priceNum = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 380;
        const itemTotal = priceNum * qty;
        total += itemTotal;
        
        if (isAr) {
            itemsText += `• ${item.name} (${item.size || '100 مل'})
  الكمية: ${qty} × ${priceNum} = ${itemTotal} د.إ

`;
        } else {
            itemsText += `• ${item.name} (${item.size || '100ml'})
  Qty: ${qty} x ${priceNum} = ${itemTotal} AED

`;
        }
    });

    let msg = '';
    if (isAr) {
        msg = `🦅 *طلب جديد — متجر عجمان لكجري*
` +
              `━━━━━━━━━━━━━━━━━━━━
` +
              `📌 *تفاصيل العطور المختارة:*

` +
              itemsText +
              `━━━━━━━━━━━━━━━━━━━━
` +
              `💰 *المجموع النهائي:* ${total} درهم إماراتي
` +
              `🚚 *الشحن:* مجاني وسريع لكافة دول الخليج
` +
              `🛡️ *الضمان:* الضمان الذهبي مع عينة تجربة مجانية
` +
              `━━━━━━━━━━━━━━━━━━━━
` +
              `يرجى تأكيد استلام الطلب لتزويدكم بالاسم وعنوان التوصيل.`;
    } else {
        msg = `🦅 *New Order — AJMAN LUXURY*
` +
              `━━━━━━━━━━━━━━━━━━━━
` +
              `📌 *Order Items:*

` +
              itemsText +
              `━━━━━━━━━━━━━━━━━━━━
` +
              `💰 *Total Amount:* ${total} AED
` +
              `🚚 *Shipping:* Complimentary Express Delivery
` +
              `🛡️ *Guarantee:* Golden Trial Sample Guarantee
` +
              `━━━━━━━━━━━━━━━━━━━━
` +
              `Please confirm my order to provide delivery details.`;
    }

    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
}

/* 8. Checkout Page Form Submission to WhatsApp */
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.querySelector('[data-checkout-form]');
    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(checkoutForm);
        const name = formData.get('name') || '';
        const phone = formData.get('phone') || '';
        const email = formData.get('email') || '';
        const address = formData.get('address') || '';
        
        const cart = readCart();
        const isAr = document.documentElement.lang !== 'en';
        let total = 0;
        let itemsText = '';

        cart.forEach((item) => {
            const qty = item.quantity || 1;
            const priceNum = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 380;
            const itemTotal = priceNum * qty;
            total += itemTotal;
            itemsText += `• ${item.name} (${item.size || '100 مل'}) × ${qty} = ${itemTotal} د.إ
`;
        });

        const msg = `🦅 *طلب شراء فوري — متجر عجمان لكجري*
` +
                    `━━━━━━━━━━━━━━━━━━━━
` +
                    `👤 *بيانات العميل والتوصيل:*
` +
                    `• الاسم: ${name}
` +
                    `• الهاتف: ${phone}
` +
                    `• العنوان: ${address}
` +
                    (email ? `• البريد: ${email}
` : '') +
                    `━━━━━━━━━━━━━━━━━━━━
` +
                    `📌 *العطور المطلوبة:*
` +
                    (itemsText || '• طلب مخصص
') +
                    `━━━━━━━━━━━━━━━━━━━━
` +
                    `💰 *المجموع:* ${total || 'حسب الفاتورة'} درهم (شامل الشحن والضريبة)
` +
                    `━━━━━━━━━━━━━━━━━━━━
` +
                    `تم إرسال الطلب عبر المتجر، بانتظار التأكيد وموعد التوصيل.`;

        const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
    });
});
