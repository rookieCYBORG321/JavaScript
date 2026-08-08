/**
 * Automated Billing Engine Module
 */
const BillingEngine = (() => {
    // Module State
    let cart = [];

    // DOM References
    const DOM = {
        addItemForm: document.getElementById('addItemForm'),
        productSelect: document.getElementById('productSelect'),
        productQty: document.getElementById('productQty'),
        cartTableBody: document.getElementById('cartTableBody'),
        taxRateInput: document.getElementById('taxRate'),
        generateInvoiceBtn: document.getElementById('generateInvoiceBtn'),
        invoiceOutput: document.getElementById('invoiceOutput')
    };

    // Calculate Discount based on Subtotal Thresholds
    const calculateDiscountPercentage = (subtotal) => {
        if (subtotal > 20000) return 20;
        if (subtotal > 10000) return 15;
        if (subtotal > 5000) return 10;
        return 0;
    };

    // Render Dynamic Cart Rows
    const renderCart = () => {
        DOM.cartTableBody.innerHTML = '';

        if (cart.length === 0) {
            DOM.cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8;">Cart is empty</td></tr>`;
            return;
        }

        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>₹${(item.price * item.qty).toFixed(2)}</td>
                <td><button class="btn-danger" onclick="BillingEngine.removeItem(${index})">Remove</button></td>
            `;
            DOM.cartTableBody.appendChild(row);
        });
    };

    // Render Final Itemized Invoice onto DOM
    const renderInvoice = () => {
        if (cart.length === 0) {
            DOM.invoiceOutput.innerHTML = `<p class="placeholder-text" style="color:var(--error);">Cannot generate invoice with an empty cart.</p>`;
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const discountRate = calculateDiscountPercentage(subtotal);
        const discountAmount = (subtotal * discountRate) / 100;
        const discountedSubtotal = subtotal - discountAmount;

        const taxRate = parseFloat(DOM.taxRateInput.value) || 0;
        const taxAmount = (discountedSubtotal * taxRate) / 100;
        const grandTotal = discountedSubtotal + taxAmount;

        const invoiceId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
        const currentDate = new Date().toLocaleDateString();

        let itemsHtml = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>₹${(item.price * item.qty).toFixed(2)}</td>
            </tr>
        `).join('');

        DOM.invoiceOutput.innerHTML = `
            <div class="invoice-card">
                <div class="invoice-header">
                    <div>
                        <h3>TAX INVOICE</h3>
                        <p style="font-size: 12px; color: #64748b;">Ref: ${invoiceId}</p>
                    </div>
                    <div style="text-align: right;">
                        <p><strong>Date:</strong> ${currentDate}</p>
                        <p style="font-size: 13px; color: #64748b;">PRN: 24070521241</p>
                    </div>
                </div>

                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="invoice-summary">
                    <div class="summary-row"><span>Subtotal:</span> <span>₹${subtotal.toFixed(2)}</span></div>
                    <div class="summary-row"><span>Discount (${discountRate}%):</span> <span>-₹${discountAmount.toFixed(2)}</span></div>
                    <div class="summary-row"><span>GST (${taxRate}%):</span> <span>+₹${taxAmount.toFixed(2)}</span></div>
                    <div class="summary-row total"><span>Grand Total:</span> <span>₹${grandTotal.toFixed(2)}</span></div>
                </div>
                <div style="clear: both;"></div>
            </div>
        `;
    };

    return {
        init: () => {
            renderCart();

            DOM.addItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const selectedOption = DOM.productSelect.options[DOM.productSelect.selectedIndex];

                if (!selectedOption.value) return;

                const name = selectedOption.value;
                const price = parseFloat(selectedOption.dataset.price);
                const qty = parseInt(DOM.productQty.value);

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.qty += qty;
                } else {
                    cart.push({ name, price, qty });
                }

                renderCart();
                DOM.addItemForm.reset();
            });

            DOM.generateInvoiceBtn.addEventListener('click', renderInvoice);
        },
        removeItem: (index) => {
            cart.splice(index, 1);
            renderCart();
        }
    };
})();

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', BillingEngine.init);