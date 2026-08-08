/**
 * Academic Scholarship Evaluation Engine Module
 */
const ScholarshipEngine = (() => {
    // DOM References
    const DOM = {
        form: document.getElementById('scholarshipForm'),
        cgpaInput: document.getElementById('cgpa'),
        incomeInput: document.getElementById('income'),
        categorySelect: document.getElementById('category'),
        quotaSelect: document.getElementById('specialQuota'),
        outputBox: document.getElementById('evaluationOutput'),
        cgpaErr: document.getElementById('cgpaError'),
        incomeErr: document.getElementById('incomeError')
    };

    // Form Field Validation Logic
    const validateInputs = (cgpa, income) => {
        let isValid = true;

        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            DOM.cgpaErr.style.display = 'block';
            isValid = false;
        } else {
            DOM.cgpaErr.style.display = 'none';
        }

        if (isNaN(income) || income < 0) {
            DOM.incomeErr.style.display = 'block';
            isValid = false;
        } else {
            DOM.incomeErr.style.display = 'none';
        }

        return isValid;
    };

    // Conditional Decision Logic Engine
    const evaluateCriteria = (cgpa, income, category, quota) => {
        // Priority Tier 1: 100% Full Fee Waiver
        if ((cgpa >= 9.0 && income <= 300000) || (cgpa >= 8.5 && quota === 'Pwd') || (cgpa >= 8.5 && category === 'SC/ST' && income <= 500000)) {
            return {
                status: 'Approved',
                title: 'Presidential Full Merit Scholarship',
                waiver: '100% Tuition Fee Waiver',
                stipend: '₹5,000 / Month Allowance',
                cssClass: 'approved'
            };
        }

        // Priority Tier 2: 50% Merit-Cum-Means Waiver
        if ((cgpa >= 8.0 && income <= 600000) || (cgpa >= 7.5 && (category === 'OBC' || category === 'Single Girl Child') && income <= 400000) || (quota === 'Sports' && cgpa >= 7.5)) {
            return {
                status: 'Approved',
                title: 'Merit-Cum-Means Scholarship',
                waiver: '50% Tuition Fee Waiver',
                stipend: 'Standard Library Access',
                cssClass: 'approved'
            };
        }

        // Priority Tier 3: 25% Academic Assistance
        if (cgpa >= 7.5 && income <= 800000) {
            return {
                status: 'Partial Waiver',
                title: 'Institutional Academic Grant',
                waiver: '25% Tuition Fee Waiver',
                stipend: 'None',
                cssClass: 'partial'
            };
        }

        // Tier 4: Ineligible
        return {
            status: 'Ineligible',
            title: 'Criteria Not Met',
            waiver: '0% Waiver',
            stipend: 'None',
            cssClass: 'rejected'
        };
    };

    // Render Matrix Result to DOM
    const renderResult = (result, cgpa, income, category) => {
        DOM.outputBox.innerHTML = `
            <div class="matrix-card ${result.cssClass}">
                <div class="result-title">${result.title}</div>
                <div class="result-row"><span>Status State:</span> <span>${result.status}</span></div>
                <div class="result-row"><span>Financial Benefit:</span> <span>${result.waiver}</span></div>
                <div class="result-row"><span>Stipend / Support:</span> <span>${result.stipend}</span></div>
                <hr style="margin: 10px 0; border: 0; border-top: 1px solid #cbd5e1;">
                <div class="result-row"><span>Evaluated CGPA:</span> <span>${cgpa.toFixed(2)} / 10</span></div>
                <div class="result-row"><span>Evaluated Income:</span> <span>₹${income.toLocaleString('en-IN')}</span></div>
                <div class="result-row"><span>Category:</span> <span>${category}</span></div>
            </div>
        `;
    };

    // Public API Methods
    return {
        init: () => {
            DOM.form.addEventListener('submit', (e) => {
                e.preventDefault();

                const cgpa = parseFloat(DOM.cgpaInput.value);
                const income = parseFloat(DOM.incomeInput.value);
                const category = DOM.categorySelect.value;
                const quota = DOM.quotaSelect.value;

                if (validateInputs(cgpa, income)) {
                    const result = evaluateCriteria(cgpa, income, category, quota);
                    renderResult(result, cgpa, income, category);
                }
            });
        }
    };
})();

// Initialize Module on DOM Loaded
document.addEventListener('DOMContentLoaded', ScholarshipEngine.init);