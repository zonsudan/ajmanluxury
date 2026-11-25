/* ==========================================================================
   AJMAN LUXURY — Exact 3saf.com Interactive Engine & Purchasing System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTransparentHeaderScroll();
    initMobileDrawer();
    initSearchDropBar();
    initCartDrawer();
    initAddToCartButtons();
    initScrollToTop();
    initTrioBundleBuilder();
    initProductDetailTierSelector();
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
                const titleNode = card.querySelector('.product-title');
                const title = titleNode ? titleNode.textContent.toLowerCase() : '';
                if (title.includes(query)) {
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
                <p style="font-size: 0.9rem; margin-top: 0.4rem;">اختر أحد عطور النيش الفاخرة أو صمم باقتك الخاصة لتجربتها مع عينة مجانية.</p>
            </div>
        `;
        if (subtotalNode) subtotalNode.textContent = '0 د.إ';
        return;
    }

    let subtotal = 0;
    itemsContainer.innerHTML = cart.map((item, index) => {
        const priceNum = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 380;
        subtotal += priceNum * item.quantity;

        let scentsHtml = '';
        if (item.selectedScents && item.selectedScents.length > 0) {
            scentsHtml = `
                <div class="cart-scents-preview" style="font-size: 0.72rem; color: #777; margin: 3px 0; line-height: 1.3;">
                    <i class="fas fa-check" style="color: #900c3f; font-size: 0.65rem;"></i> ${item.selectedScents.join(' • ')}
                </div>
            `;
        }

        return `
            <div class="cart-item-row">
                <img src="${item.image || '/images/products/president.png'}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    ${scentsHtml}
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
            
            let bundleScents = null;
            if (btn.dataset.bundleScents) {
                try {
                    bundleScents = JSON.parse(btn.dataset.bundleScents);
                } catch(e) {}
            }

            const cart = readCart();
            const existing = cart.find(item => item.id === id && (!bundleScents || JSON.stringify(item.selectedScents) === JSON.stringify(bundleScents)));

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    selectedScents: bundleScents,
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

/* 7. Homepage Interactive Trio Bundle Builder */
function initTrioBundleBuilder() {
    const builder = document.getElementById('trioBuilderWrap');
    if (!builder) return;

    let selected = []; // Array of { id, name, img }
    const tiles = builder.querySelectorAll('.trio-select-tile');
    const counterPill = document.getElementById('trioCounterPill');
    const slots = [
        document.getElementById('trioTraySlot0'),
        document.getElementById('trioTraySlot1'),
        document.getElementById('trioTraySlot2')
    ];
    const waBtn = document.getElementById('trioOrderWhatsappBtn');
    const cartBtn = document.getElementById('trioAddToCartBtn');
    const isAr = document.documentElement.lang !== 'en';

    function updateTrioUI() {
        // Update tiles active state
        tiles.forEach(tile => {
            const id = tile.dataset.perfumeId;
            if (selected.some(p => p.id === id)) {
                tile.classList.add('selected');
            } else {
                tile.classList.remove('selected');
            }
        });

        // Update counter
        const count = selected.length;
        if (counterPill) {
            counterPill.textContent = `${count} / 3 ${isAr ? 'مختار' : 'selected'}`;
            if (count === 3) {
                counterPill.classList.add('complete');
                counterPill.textContent = isAr ? '3 / 3 (اكتملت الباقة ✨)' : '3 / 3 (Complete ✨)';
            } else {
                counterPill.classList.remove('complete');
            }
        }

        // Update slots
        slots.forEach((slot, index) => {
            if (!slot) return;
            const p = selected[index];
            if (p) {
                slot.className = 'trio-tray-slot filled';
                slot.innerHTML = `
                    <div class="slot-filled-card">
                        <img src="${p.img}?v=4.0" alt="${p.name}">
                        <span class="slot-filled-name">${p.name}</span>
                        <button type="button" class="slot-remove-btn" data-remove-index="${index}" title="إزالة">✕</button>
                    </div>
                `;
            } else {
                slot.className = 'trio-tray-slot';
                slot.innerHTML = `
                    <div class="slot-empty">
                        <i class="fas fa-plus"></i>
                        <span>${isAr ? `عطر ${index + 1}` : `Scent ${index + 1}`}</span>
                    </div>
                `;
            }
        });

        // Attach remove buttons inside slots
        builder.querySelectorAll('.slot-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const removeIdx = parseInt(btn.dataset.removeIndex);
                selected.splice(removeIdx, 1);
                updateTrioUI();
            });
        });
    }

    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const id = tile.dataset.perfumeId;
            const name = tile.dataset.perfumeName;
            const img = tile.dataset.perfumeImg;

            const existingIdx = selected.findIndex(p => p.id === id);
            if (existingIdx > -1) {
                selected.splice(existingIdx, 1);
            } else {
                if (selected.length >= 3) {
                    alert(isAr ? 'لقد اخترت 3 عطور بالفعل! انقر على أحد العطور المختارة لتغييره.' : 'You have already selected 3 fragrances! Click any selected item to change.');
                    return;
                }
                selected.push({ id, name, img });
            }
            updateTrioUI();
        });
    });

    const royalWaBtn = document.getElementById('royalWhatsappOrderBtn');
    if (royalWaBtn) {
        royalWaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = isAr
                ? `🦅 *طلب جديد — متجر عجمان لكجري*\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `👑 *البوكس الملكي الشامل (مجموعة الـ 5 عطور كاملة)*\n` +
                  `• بريزدنت (President)\n` +
                  `• فيرست ليدي (First Lady)\n` +
                  `• تشيرمان (Chairman)\n` +
                  `• كاونسل (Council)\n` +
                  `• بارليامنت (Parliament)\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `الحجم: 5 زجاجات × 100 مل\n` +
                  `💰 *سعر العرض:* 1,490 درهم (بدلاً من 2,490 درهم)\n` +
                  `🚚 *الشحن:* مجاني وسريع لكافة دول الخليج\n` +
                  `🎁 *المميزات:* صندوق إهداء فاخر + 5 عينات تجربة\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `يرجى تأكيد الطلب لتزويدكم بالاسم وعنوان التوصيل.`
                : `🦅 *New Order — AJMAN LUXURY*\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `👑 *The Royal 5-in-1 Collector's Box*\n` +
                  `All 5 Fragrances (5 x 100ml):\n` +
                  `• President\n` +
                  `• First Lady\n` +
                  `• Chairman\n` +
                  `• Council\n` +
                  `• Parliament\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `💰 *Special Offer:* 1,490 AED (was 2,490 AED)\n` +
                  `🚚 *Shipping:* Free VIP Express Delivery\n` +
                  `🎁 *Includes:* Bespoke gift case + 5 tester samples\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `Please confirm my order.`;
            window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    if (waBtn) {
        waBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (selected.length !== 3) {
                alert(isAr ? 'يرجى اختيار 3 عطور لإكمال باقة السلكشن قبل إرسال الطلب عبر واتساب.' : 'Please select 3 fragrances to complete your trio before ordering.');
                return;
            }

            const scentNames = selected.map((p, i) => `  ${i + 1}. ${p.name} (100 مل)`).join('\n');
            const msg = isAr 
                ? `🦅 *طلب جديد — متجر عجمان لكجري*\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `📦 *سلكشن الـ 3 عطور الفاخرة (باختياري):*\n\n` +
                  `${scentNames}\n\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `💰 *سعر العرض:* 990 درهم إماراتي (بدلاً من 1,500 درهم)\n` +
                  `🚚 *الشحن:* مجاني وسريع لكافة دول الخليج\n` +
                  `🛡️ *الضمان:* عينات تجربة مجانية + ضمان استرجاع كامل\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `يرجى تأكيد استلام الطلب لتزويدكم بالاسم وعنوان التوصيل.`
                : `🦅 *New Order — AJMAN LUXURY*\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `📦 *Custom Trio Fragrance Selection:*\n\n` +
                  `${scentNames}\n\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `💰 *Special Bundle Price:* 990 AED (was 1,500 AED)\n` +
                  `🚚 *Shipping:* Complimentary Express GCC Delivery\n` +
                  `🛡️ *Guarantee:* Free Testers & Full Return Policy\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `Please confirm my order to provide delivery details.`;

            window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (selected.length !== 3) {
                alert(isAr ? 'يرجى اختيار 3 عطور لإكمال الباقة قبل إضافتها للسلة.' : 'Please select 3 fragrances to complete your trio.');
                return;
            }

            const cart = readCart();
            cart.push({
                id: 'trio-bundle-' + Date.now(),
                name: isAr ? 'سلكشن 3 عطور فاخرة (باختيارك)' : 'Custom Trio Fragrance Selection',
                price: '990 درهم',
                image: selected[0].img,
                selectedScents: selected.map(p => p.name),
                quantity: 1,
                size: '3 × 100 مل'
            });

            saveCart(cart);
            const overlay = document.getElementById('cartOverlay');
            if (overlay) overlay.classList.add('active');
        });
    }
}

/* 8. Product Detail Page Tier Selector (Single / Trio / Royal 5) */
function initProductDetailTierSelector() {
    const box = document.getElementById('productTierSelectorBox');
    if (!box) return;

    const options = box.querySelectorAll('.tier-card-option');
    const companionBox = document.getElementById('detailTrioCompanionPicker');
    const companionTiles = box.querySelectorAll('.companion-tile');
    const companionCounter = document.getElementById('detailCompanionCounter');
    const waBtn = document.querySelector('.detail-wa-btn');
    const addBtn = document.querySelector('.detail-add-btn');
    const priceDisplay = document.querySelector('.detail-price');
    const isAr = document.documentElement.lang !== 'en';

    const currentName = addBtn ? addBtn.dataset.productName : '';
    const currentPrice = addBtn ? addBtn.dataset.productPrice : '';
    const currentImage = addBtn ? addBtn.dataset.productImage : '';
    const currentId = addBtn ? addBtn.dataset.productId : '';

    let activeTier = 'single';
    let selectedCompanions = [];

    function updateTierDisplay() {
        options.forEach(opt => {
            if (opt.dataset.tier === activeTier) {
                opt.classList.add('active');
                const radio = opt.querySelector('input');
                if (radio) radio.checked = true;
            } else {
                opt.classList.remove('active');
            }
        });

        if (activeTier === 'trio') {
            if (companionBox) companionBox.style.display = 'block';
            if (priceDisplay) priceDisplay.textContent = isAr ? '990 درهم' : 'AED 990';
        } else if (activeTier === 'royal5') {
            if (companionBox) companionBox.style.display = 'none';
            if (priceDisplay) priceDisplay.textContent = isAr ? '1,490 درهم' : 'AED 1,490';
        } else {
            if (companionBox) companionBox.style.display = 'none';
            if (priceDisplay) priceDisplay.textContent = currentPrice;
        }

        updateActionButtons();
    }

    function updateActionButtons() {
        if (!waBtn || !addBtn) return;

        if (activeTier === 'single') {
            const msg = isAr 
                ? `مرحباً عجمان لكجري 🦅\nأود طلب عطر: ${currentName}\nالحجم: 100 مل\nالسعر: ${currentPrice}\n(شامل الضريبة والشحن السريع المجاني)\nيرجى تأكيد الطلب لتزويدكم بعنوان التوصيل.`
                : `Hello AJMAN LUXURY 🦅\nI would like to order: ${currentName}\nSize: 100ml\nPrice: ${currentPrice}\nPlease confirm my order.`;
            waBtn.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
            addBtn.dataset.productId = currentId;
            addBtn.dataset.productName = currentName;
            addBtn.dataset.productPrice = currentPrice;
            addBtn.dataset.productImage = currentImage;
            delete addBtn.dataset.bundleScents;
        } else if (activeTier === 'trio') {
            const companionsText = selectedCompanions.map(c => c.name).join(' + ');
            const allThree = [currentName, ...selectedCompanions.map(c => c.name)];
            const listFormatted = allThree.map((name, i) => `  ${i + 1}. ${name} (100 مل)`).join('\n');
            const msg = isAr
                ? `🦅 *طلب جديد — متجر عجمان لكجري*\n━━━━━━━━━━━━━━━━━━━━\n📦 *سلكشن الـ 3 عطور الفاخرة:*
\n${listFormatted}\n\n━━━━━━━━━━━━━━━━━━━━\n💰 *سعر العرض:* 990 درهم (بدلاً من 1,500 درهم)\n🚚 *الشحن:* مجاني وسريع مع عينات تجربة\nيرجى تأكيد الطلب.`
                : `🦅 *New Order — AJMAN LUXURY*\n━━━━━━━━━━━━━━━━━━━━\n📦 *Custom Trio Selection:*\n\n${listFormatted}\n\n━━━━━━━━━━━━━━━━━━━━\nPrice: 990 AED\nPlease confirm.`;
            waBtn.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
            addBtn.dataset.productId = 'trio-bundle-' + Date.now();
            addBtn.dataset.productName = isAr ? `سلكشن 3 عطور (${currentName}${companionsText ? ' + ' + companionsText : ''})` : `Custom Trio (${currentName})`;
            addBtn.dataset.productPrice = '990 درهم';
            addBtn.dataset.productImage = currentImage;
            addBtn.dataset.bundleScents = JSON.stringify(allThree);
        } else if (activeTier === 'royal5') {
            const msg = isAr
                ? `🦅 *طلب جديد — متجر عجمان لكجري*\n━━━━━━━━━━━━━━━━━━━━\n👑 *البوكس الملكي الشامل (مجموعة الـ 5 عطور كاملة)*\n• بريزدنت\n• فيرست ليدي\n• تشيرمان\n• كاونسل\n• بارليامنت\n━━━━━━━━━━━━━━━━━━━━\nالحجم: 5 زجاجات × 100 مل\n💰 *سعر العرض:* 1,490 درهم (بدلاً من 2,490 درهم)\nمع صندوق الإهداء الملكي و5 عينات والشحن المجاني.\nيرجى تأكيد الطلب.`
                : `🦅 *New Order — AJMAN LUXURY*\n━━━━━━━━━━━━━━━━━━━━\n👑 *The Royal 5-in-1 Collector's Box*\n5 Bottles x 100ml for 1,490 AED.\nPlease confirm.`;
            waBtn.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
            addBtn.dataset.productId = 'royal-box-5';
            addBtn.dataset.productName = isAr ? 'البوكس الملكي الشامل (5 عطور فاخرة 100 مل)' : 'The Royal 5-in-1 Collector Box';
            addBtn.dataset.productPrice = '1,490 درهم';
            addBtn.dataset.productImage = '/images/products/royal-box-5.png';
            addBtn.dataset.bundleScents = JSON.stringify(['بريزدنت', 'فيرست ليدي', 'تشيرمان', 'كاونسل', 'بارليامنت']);
        }
    }

    options.forEach(opt => {
        opt.addEventListener('click', () => {
            activeTier = opt.dataset.tier;
            updateTierDisplay();
        });
    });

    companionTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const id = tile.dataset.companionId;
            const name = tile.dataset.companionName;
            const idx = selectedCompanions.findIndex(c => c.id === id);

            if (idx > -1) {
                selectedCompanions.splice(idx, 1);
            } else {
                if (selectedCompanions.length >= 2) {
                    selectedCompanions.shift();
                }
                selectedCompanions.push({ id, name });
            }

            companionTiles.forEach(t => {
                if (selectedCompanions.some(c => c.id === t.dataset.companionId)) {
                    t.classList.add('selected');
                } else {
                    t.classList.remove('selected');
                }
            });

            if (companionCounter) {
                companionCounter.textContent = `${selectedCompanions.length} / 2`;
                if (selectedCompanions.length === 2) {
                    companionCounter.classList.add('done');
                } else {
                    companionCounter.classList.remove('done');
                }
            }

            updateActionButtons();
        });
    });

    // Validate on add to bag
    addBtn.addEventListener('click', (e) => {
        if (activeTier === 'trio' && selectedCompanions.length < 2) {
            e.preventDefault();
            e.stopPropagation();
            alert(isAr ? 'يرجى اختيار عطرين إضافيين ليكتمل سلكشن الـ 3 عطور أولاً.' : 'Please select 2 additional fragrances to complete your trio.');
            return false;
        }
    }, true);
}

/* 9. WhatsApp Direct Checkout Engine */
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
        
        if (item.selectedScents && item.selectedScents.length > 0) {
            const scentsList = item.selectedScents.map((s, idx) => `      ${idx + 1}. ${s}`).join('\n');
            if (isAr) {
                itemsText += `• ${item.name}\n  العطور المختارة:\n${scentsList}\n  الكمية: ${qty} × ${priceNum} = ${itemTotal} د.إ\n\n`;
            } else {
                itemsText += `• ${item.name}\n  Selected Scents:\n${scentsList}\n  Qty: ${qty} x ${priceNum} = ${itemTotal} AED\n\n`;
            }
        } else {
            if (isAr) {
                itemsText += `• ${item.name} (${item.size || '100 مل'})\n  الكمية: ${qty} × ${priceNum} = ${itemTotal} د.إ\n\n`;
            } else {
                itemsText += `• ${item.name} (${item.size || '100ml'})\n  Qty: ${qty} x ${priceNum} = ${itemTotal} AED\n\n`;
            }
        }
    });

    let msg = '';
    if (isAr) {
        msg = `🦅 *طلب جديد — متجر عجمان لكجري*\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `📌 *تفاصيل العطور المختارة:*\n\n` +
              itemsText +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `💰 *المجموع النهائي:* ${total} درهم إماراتي\n` +
              `🚚 *الشحن:* مجاني وسريع لكافة دول الخليج\n` +
              `🛡️ *الضمان:* الضمان الذهبي مع عينة تجربة مجانية\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `يرجى تأكيد استلام الطلب لتزويدكم بالاسم وعنوان التوصيل.`;
    } else {
        msg = `🦅 *New Order — AJMAN LUXURY*\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `📌 *Order Items:*\n\n` +
              itemsText +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `💰 *Total Amount:* ${total} AED\n` +
              `🚚 *Shipping:* Complimentary Express Delivery\n` +
              `🛡️ *Guarantee:* Golden Trial Sample Guarantee\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `Please confirm my order to provide delivery details.`;
    }

    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
}

/* 10. Checkout Page Form Submission to WhatsApp */
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
            if (item.selectedScents && item.selectedScents.length > 0) {
                itemsText += `• ${item.name} (${item.selectedScents.join(' + ')}) × ${qty} = ${itemTotal} د.إ\n`;
            } else {
                itemsText += `• ${item.name} (${item.size || '100 مل'}) × ${qty} = ${itemTotal} د.إ\n`;
            }
        });

        const msg = `🦅 *طلب شراء فوري — متجر عجمان لكجري*\n` +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `👤 *بيانات العميل والتوصيل:*\n` +
                    `• الاسم: ${name}\n` +
                    `• الهاتف: ${phone}\n` +
                    `• العنوان: ${address}\n` +
                    (email ? `• البريد: ${email}\n` : '') +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `📌 *العطور المطلوبة:*\n` +
                    (itemsText || '• طلب مخصص\n') +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `💰 *المجموع:* ${total || 'حسب الفاتورة'} درهم (شامل الشحن والضريبة)\n` +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `تم إرسال الطلب عبر المتجر، بانتظار التأكيد وموعد التوصيل.`;

        const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
    });
});
