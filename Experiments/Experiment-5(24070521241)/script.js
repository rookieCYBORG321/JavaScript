/**
 * Practical: Cart Total Calculator with Custom Adjustable Discount Percentage
 */

// Student Profile Object
const STUDENT_INFO = Object.freeze({
    name: "Parth Jani",
    prn: "24070521241"
});

// Coupon Presets
const AVAILABLE_COUPONS = [
    { code: "PARTH10", discountPercent: 10, minSpend: 0 },
    { code: "JANI20", discountPercent: 20, minSpend: 2000 }
];

// Shopping Cart Initial State
let shoppingCart = [
    { id: 1, name: "Mechanical Keyboard", price: 2500, qty: 1, category: "Electronics" },
    { id: 2, name: "Tech Backpack", price: 1200, qty: 1, category: "Fashion" }
];

// Dynamic Discount State
let currentDiscountRate = 10; // Default 10% discount
let activeLabel = "Custom 10%";

// DOM References
const DOM = {
    form: document.getElementById('productForm'),
    nameInput: document.getElementById('itemName'),
    priceInput: document.getElementById('itemPrice'),
    qtyInput: document.getElementById('itemQty'),
    categoryInput: document.getElementById('itemCategory'),
    percentInput: document.getElementById('discountPercentInput'),
    applyPercentBtn: document.getElementById('applyPercentBtn'),
    couponInput: document.getElementById('couponInput'),
    applyCouponBtn: document.getElementById('applyCouponBtn'),
    couponMsg: document.getElementById('couponMessage'),
    cartBody: document.getElementById('cartTableBody'),
    summaryBlock: document.getElementById('cartSummaryBlock'),
    clearBtn: document.getElementById('clearCartBtn')
};

// ==========================================
// 1. CALCULATIONS ENGINE (ARRAY METHODS)
// ==========================================

const calculateCartTotals = () => {
    // Array.prototype.reduce() for subtotal
    const subtotal = shoppingCart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Array.prototype.reduce() for item count
    const totalItemCount = shoppingCart.reduce((count, item) => count + item.qty, 0);

    // Calculate Dynamic Discount Amount based on currentDiscountRate state
    const discountAmount = (subtotal * currentDiscountRate) / 100;

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxGST = taxableAmount * 0.18; // 18% GST
    const grandTotal = taxableAmount + taxGST;

    return {
        subtotal,
        totalItemCount,
        discountAmount,
        taxGST,
        grandTotal
    };
};

// ==========================================
// 2. RENDER FUNCTIONS
// ==========================================

const renderCartUI = () => {
    if (shoppingCart.length === 0) {
        DOM.cartBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">
                    Your shopping cart is currently empty.
                </td>
            </tr>
        `;
        DOM.summaryBlock.innerHTML = `<p style="text-align:center; color: var(--text-muted);">Add items to view summary.</p>`;
        return;
    }

    // Array.prototype.map() to build table rows
    DOM.cartBody.innerHTML = shoppingCart.map((item, index) => {
        const { id, name, category, price, qty } = item;
        const itemSubtotal = price * qty;

        return `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${name}</td>
                <td><span style="font-size: 11px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${category}</span></td>
                <td>₹${price.toFixed(2)}</td>
                <td>${qty}</td>
                <td>₹${itemSubtotal.toFixed(2)}</td>
                <td><button class="delete-btn" onclick="removeItemFromCart(${id})">✕</button></td>
            </tr>
        `;
    }).join('');

    const { subtotal, totalItemCount, discountAmount, taxGST, grandTotal } = calculateCartTotals();

    DOM.summaryBlock.innerHTML = `
        <div class="summary-row"><span>Billed To:</span> <span><strong>${STUDENT_INFO.name} (${STUDENT_INFO.prn})</strong></span></div>
        <div class="summary-row"><span>Total Items:</span> <span>${totalItemCount} items</span></div>
        <div class="summary-row"><span>Cart Subtotal:</span> <span>₹${subtotal.toFixed(2)}</span></div>
        <div class="summary-row" style="color: ${discountAmount > 0 ? 'var(--success)' : 'inherit'};">
            <span>Discount Applied (${currentDiscountRate}% - ${activeLabel}):</span> 
            <span>-₹${discountAmount.toFixed(2)}</span>
        </div>
        <div class="summary-row"><span>GST Tax Addition (18%):</span> <span>+₹${taxGST.toFixed(2)}</span></div>
        <div class="summary-row total-row"><span>Grand Total:</span> <span>₹${grandTotal.toFixed(2)}</span></div>
    `;
};

// Helper for Status Alerts
const showStatusMsg = (msg, type) => {
    DOM.couponMsg.textContent = msg;
    DOM.couponMsg.className = `coupon-status ${type}`;
};

// ==========================================
// 3. EVENT LISTENERS
// ==========================================

// Add Product Event
DOM.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        id: Date.now(),
        name: DOM.nameInput.value.trim(),
        price: parseFloat(DOM.priceInput.value),
        qty: parseInt(DOM.qtyInput.value),
        category: DOM.categoryInput.value
    };

    const existingItem = shoppingCart.find(item => item.name.toLowerCase() === newProduct.name.toLowerCase());

    if (existingItem) {
        existingItem.qty += newProduct.qty;
    } else {
        shoppingCart.push(newProduct);
    }

    DOM.form.reset();
    DOM.qtyInput.value = 1;
    renderCartUI();
});

// Remove Item Event
window.removeItemFromCart = (id) => {
    shoppingCart = shoppingCart.filter(item => item.id !== id);
    renderCartUI();
};

// 1. DYNAMIC DISCOUNT PERCENTAGE CHANGE HANDLER
const updateDiscountPercent = () => {
    const val = parseFloat(DOM.percentInput.value);

    if (isNaN(val) || val < 0 || val > 100) {
        showStatusMsg("Please enter a valid discount percentage between 0 and 100.", "error");
        return;
    }

    currentDiscountRate = val;
    activeLabel = "Custom Value";
    DOM.couponInput.value = '';
    showStatusMsg(`Discount percentage set to ${currentDiscountRate}%`, "success");
    renderCartUI();
};

DOM.applyPercentBtn.addEventListener('click', updateDiscountPercent);

// Live update on input change
DOM.percentInput.addEventListener('input', () => {
    const val = parseFloat(DOM.percentInput.value);
    if (!isNaN(val) && val >= 0 && val <= 100) {
        currentDiscountRate = val;
        activeLabel = "Custom Value";
        renderCartUI();
    }
});

// 2. PRESET PROMO CODE HANDLER
DOM.applyCouponBtn.addEventListener('click', () => {
    const codeInput = DOM.couponInput.value.trim().toUpperCase();
    const foundCoupon = AVAILABLE_COUPONS.find(c => c.code === codeInput);

    if (!foundCoupon) {
        showStatusMsg("Invalid Promo Code.", "error");
        return;
    }

    const { subtotal } = calculateCartTotals();

    if (subtotal < foundCoupon.minSpend) {
        showStatusMsg(`Code '${foundCoupon.code}' requires a minimum spend of ₹${foundCoupon.minSpend}`, "error");
        return;
    }

    currentDiscountRate = foundCoupon.discountPercent;
    DOM.percentInput.value = currentDiscountRate;
    activeLabel = `Code ${foundCoupon.code}`;
    showStatusMsg(`Promo Code '${foundCoupon.code}' applied (${foundCoupon.discountPercent}% OFF)`, "success");
    renderCartUI();
});

// Clear Entire Cart
DOM.clearBtn.addEventListener('click', () => {
    shoppingCart = [];
    DOM.couponMsg.style.display = 'none';
    renderCartUI();
});

// Application Init
document.addEventListener('DOMContentLoaded', () => {
    renderCartUI();
});