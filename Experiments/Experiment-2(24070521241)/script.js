/**
 * Practical 2: Variable Declarations (var, let, const), Template Literals, and Destructuring
 */

// ==========================================
// 1. VARIABLE DECLARATIONS (var, let, const)
// ==========================================

// Legacy global configuration using 'var'
var GLOBAL_TAX_RATE = 0.18; // 18% GST Rate

// Immutable configurations using 'const'
const STUDENT_NAME = "Parth Jani";
const PRN_ID = "24070521241";
const DISCOUNT_THRESHOLD = 3000;

// Mutable array state using 'let'
let billingCart = [];

// ==========================================
// 2. DOM REFERENCES (const)
// ==========================================
const DOM = {
    form: document.getElementById('billingForm'),
    nameInput: document.getElementById('itemName'),
    priceInput: document.getElementById('itemPrice'),
    qtyInput: document.getElementById('itemQty'),
    summaryDisplay: document.getElementById('summaryDisplay'),
    cartBody: document.getElementById('cartItemsBody'),
    clearBtn: document.getElementById('clearAllBtn')
};

// ==========================================
// 3. CORE CALCULATION LOGIC WITH DESTRUCTURING
// ==========================================

// Function returning an array to demonstrate ARRAY DESTRUCTURING
const calculateInvoiceTotals = () => {
    let subtotal = 0;

    // Iterating over items using OBJECT DESTRUCTURING inside loop
    billingCart.forEach(item => {
        const { price, qty } = item; // Object Destructuring
        subtotal += price * qty;
    });

    let discount = subtotal >= DISCOUNT_THRESHOLD ? subtotal * 0.10 : 0; // 10% discount if subtotal >= 3000
    let taxableAmount = subtotal - discount;
    let taxAmount = taxableAmount * GLOBAL_TAX_RATE;
    let grandTotal = taxableAmount + taxAmount;

    // Returning array for destructuring
    return [subtotal, discount, taxAmount, grandTotal];
};

// ==========================================
// 4. RENDER ENGINE USING TEMPLATE LITERALS
// ==========================================

const renderApp = () => {
    // 1. Render Table Rows using Template Literals & Object Destructuring
    DOM.cartBody.innerHTML = '';

    if (billingCart.length === 0) {
        DOM.cartBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color: #94a3b8; padding: 20px;">
                    No billing items added yet.
                </td>
            </tr>
        `;
        DOM.summaryDisplay.innerHTML = `<p class="empty-notice">No items added to invoice yet.</p>`;
        return;
    }

    billingCart.forEach((item, index) => {
        // Object Destructuring
        const { name, price, qty } = item;
        const itemSubtotal = price * qty;

        // Template Literal string interpolation
        const rowHTML = `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${name}</td>
                <td>₹${price.toFixed(2)}</td>
                <td>${qty}</td>
                <td>₹${itemSubtotal.toFixed(2)}</td>
                <td>
                    <button class="del-item-btn" onclick="removeBillingItem(${index})">Remove</button>
                </td>
            </tr>
        `;
        DOM.cartBody.innerHTML += rowHTML;
    });

    // 2. Render Calculations using ARRAY DESTRUCTURING
    const [subtotal, discount, taxAmount, grandTotal] = calculateInvoiceTotals();

    // Template Literals for complex HTML markup output
    DOM.summaryDisplay.innerHTML = `
        <div class="summary-line">
            <span>Student Billed:</span>
            <span><strong>${STUDENT_NAME} (${PRN_ID})</strong></span>
        </div>
        <div class="summary-line">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-line" style="color: ${discount > 0 ? '#059669' : 'inherit'}">
            <span>Discount (10% over ₹3,000):</span>
            <span>-₹${discount.toFixed(2)}</span>
        </div>
        <div class="summary-line"><span>GST Rate (${GLOBAL_TAX_RATE * 100}%):</span> <span>+₹${taxAmount.toFixed(2)}</span></div>
        <div class="summary-line grand-total">
            <span>Grand Total:</span>
            <span>₹${grandTotal.toFixed(2)}</span>
        </div>
    `;
};

// ==========================================
// 5. EVENT HANDLERS & INITIALIZATION
// ==========================================

DOM.form.addEventListener('submit', (e) => {
    e.preventDefault();

    let name = DOM.nameInput.value.trim();
    let price = parseFloat(DOM.priceInput.value);
    let qty = parseInt(DOM.qtyInput.value);

    if (name && !isNaN(price) && !isNaN(qty)) {
        const newItem = { name, price, qty };
        billingCart.push(newItem);

        DOM.form.reset();
        DOM.qtyInput.value = 1;
        renderApp();
    }
});

window.removeBillingItem = (index) => {
    billingCart.splice(index, 1);
    renderApp();
};

DOM.clearBtn.addEventListener('click', () => {
    billingCart = [];
    renderApp();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log(`[System Init] Billing Engine started for ${STUDENT_NAME} (PRN: ${PRN_ID})`);
    renderApp();
});