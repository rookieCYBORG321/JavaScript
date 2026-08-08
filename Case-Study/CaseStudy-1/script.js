/**
 * Modular Architecture for Academic Portal
 */
const AcademicPortal = (() => {
    // Module State
    const state = {
        institution: "Symbiosis Institute of Technology",
        department: "",
        batch: "",
        student: null
    };

    // DOM Cache
    const DOM = {
        deptSelect: document.getElementById('department'),
        batchSelect: document.getElementById('academicYear'),
        form: document.getElementById('studentForm'),
        nameInput: document.getElementById('studentName'),
        prnInput: document.getElementById('prn'),
        emailInput: document.getElementById('email'),
        semSelect: document.getElementById('semester'),
        outputBox: document.getElementById('portalOutput'),
        nameErr: document.getElementById('nameError'),
        prnErr: document.getElementById('prnError'),
        emailErr: document.getElementById('emailError')
    };

    // RegEx Rules
    const Patterns = {
        prn: /^\d{11}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        name: /^[a-zA-Z\s]{3,}$/
    };

    // Private Methods
    const syncGlobalInfo = () => {
        state.department = DOM.deptSelect.value;
        state.batch = DOM.batchSelect.value;
    };

    const validateField = (input, pattern, errorEl) => {
        const isValid = pattern.test(input.value.trim());
        errorEl.style.display = isValid ? 'none' : 'block';
        return isValid;
    };

    const renderLinkedProfile = () => {
        DOM.outputBox.innerHTML = `
            <div class="display-card">
                <h3>${state.student.name}</h3>
                <p class="prn-text">PRN: ${state.student.prn}</p>
                <div class="display-row"><span>Institution:</span> <span>${state.institution}</span></div>
                <div class="display-row"><span>Department:</span> <span>${state.department}</span></div>
                <div class="display-row"><span>Batch:</span> <span>${state.batch}</span></div>
                <div class="display-row"><span>Semester:</span> <span>${state.student.semester}</span></div>
                <div class="display-row"><span>Email:</span> <span>${state.student.email}</span></div>
                <div class="display-row"><span>System Status:</span> <span class="status-verified">Verified & Linked</span></div>
            </div>
        `;
    };

    // Public API
    return {
        init: () => {
            syncGlobalInfo();
            DOM.form.addEventListener('submit', AcademicPortal.handleSubmission);
        },
        updateSystem: () => {
            syncGlobalInfo();
            if (state.student) renderLinkedProfile();
        },
        handleSubmission: (e) => {
            e.preventDefault();

            const isNameValid = validateField(DOM.nameInput, Patterns.name, DOM.nameErr);
            const isPrnValid = validateField(DOM.prnInput, Patterns.prn, DOM.prnErr);
            const isEmailValid = validateField(DOM.emailInput, Patterns.email, DOM.emailErr);

            if (isNameValid && isPrnValid && isEmailValid) {
                state.student = {
                    name: DOM.nameInput.value.trim(),
                    prn: DOM.prnInput.value.trim(),
                    email: DOM.emailInput.value.trim(),
                    semester: DOM.semSelect.value
                };
                renderLinkedProfile();
            }
        }
    };
})();

// Initialize module on DOM Ready
document.addEventListener('DOMContentLoaded', AcademicPortal.init);