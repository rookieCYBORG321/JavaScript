/**
 * Practical 4: Function Types, Scope, Closures & Try-Catch Error Handling
 */

// ==========================================
// 1. GLOBAL SCOPE DECLARATIONS
// ==========================================
const STUDENT_NAME = "Parth Jani";
const STUDENT_PRN = "24070521241";
const GLOBAL_MAX_LENGTH = 100;

// ==========================================
// 2. CLOSURE CREATION (Private State Management)
// ==========================================
const createAnalyticsTracker = () => {
    // Private variables encapsulated within Closure Scope
    let totalChecks = 0;
    let palindromeCount = 0;
    let errorCount = 0;
    const historyLog = [];

    return {
        recordSuccess: (originalText, isPalindrome, cleanedText) => {
            totalChecks++;
            if (isPalindrome) palindromeCount++;
            historyLog.unshift({
                text: originalText,
                status: isPalindrome ? 'Palindrome' : 'Not Palindrome',
                cleaned: cleanedText,
                time: new Date().toLocaleTimeString()
            });
        },
        recordError: () => {
            errorCount++;
        },
        getStats: () => ({
            totalChecks,
            palindromeCount,
            errorCount,
            history: [...historyLog]
        })
    };
};

// Instantiate Closure
const sessionTracker = createAnalyticsTracker();


// ==========================================
// 3. MAIN APPLICATION MODULE (IIFE - Function Type 1)
// ==========================================
((() => { // IIFE

    const DOM = {
        form: document.getElementById('palindromeForm'),
        textInput: document.getElementById('textInput'),
        ignoreSpaceCb: document.getElementById('ignoreSpace'),
        ignoreCaseCb: document.getElementById('ignoreCase'),
        outputDisplay: document.getElementById('outputDisplay'),
        statTotal: document.getElementById('statTotal'),
        statPalindromes: document.getElementById('statPalindromes'),
        statErrors: document.getElementById('statErrors'),
        historyList: document.getElementById('historyList')
    };

    // ==========================================
    // 4. FUNCTION TYPES DEMONSTRATION
    // ==========================================

    // Function Type 2: Standard Function Declaration
    function sanitizeText(inputStr, stripPunctuation, forceLowerCase) {
        let processed = inputStr;

        if (forceLowerCase) {
            processed = processed.toLowerCase();
        }

        if (stripPunctuation) {
            processed = processed.replace(/[^a-zA-Z0-9]/g, '');
        }

        return processed;
    }

    // Function Type 3: Arrow Function Expression
    const reverseString = (str) => str.split('').reverse().join('');

    // Function Type 4: Anonymous Function Expression
    const checkPalindromeLogic = function (str) {
        if (str.length === 0) return false;
        const reversed = reverseString(str);
        return str === reversed;
    };

    // ==========================================
    // 5. TRY-CATCH VALIDATION & EXECUTION
    // ==========================================
    const evaluateInput = (rawText) => {
        try {
            if (!rawText || rawText.trim().length === 0) {
                throw new Error("Input string cannot be empty.");
            }

            if (rawText.length > GLOBAL_MAX_LENGTH) {
                throw new Error(`Input exceeds maximum allowed limit of ${GLOBAL_MAX_LENGTH} characters.`);
            }

            if (/^\d+$/.test(rawText.trim())) {
                throw new Error("Numeric-only inputs are invalid. Please include words or alphabetic phrases.");
            }

            const shouldStrip = DOM.ignoreSpaceCb.checked;
            const shouldIgnoreCase = DOM.ignoreCaseCb.checked;

            const cleaned = sanitizeText(rawText, shouldStrip, shouldIgnoreCase);

            if (cleaned.length === 0) {
                throw new Error("Sanitization removed all characters. No valid alphanumeric characters found.");
            }

            const isPal = checkPalindromeLogic(cleaned);

            // Record into Closure State
            sessionTracker.recordSuccess(rawText, isPal, cleaned);

            // Render Success Result
            renderSuccessResult(rawText, cleaned, isPal);

        } catch (err) {
            // Catching thrown custom errors
            sessionTracker.recordError();
            renderErrorResult(err.message);
        } finally {
            // Update Stats Display from Closure State
            updateAnalyticsUI();
        }
    };

    // ==========================================
    // 6. RENDER FUNCTIONS
    // ==========================================
    const renderSuccessResult = (original, cleaned, isPalindrome) => {
        DOM.outputDisplay.innerHTML = `
            <div class="result-box ${isPalindrome ? 'success' : 'error'}">
                <div class="result-title" style="color: ${isPalindrome ? 'var(--success)' : 'var(--error)'}">
                    ${isPalindrome ? '✓ Valid Palindrome' : '✗ Not a Palindrome'}
                </div>
                <div class="result-detail"><strong>Student Evaluated:</strong> ${STUDENT_NAME} (${STUDENT_PRN})</div>
                <div class="result-detail"><strong>Original Input:</strong> "${original}"</div>
                <div class="result-detail"><strong>Processed Text:</strong> "${cleaned}"</div>
                <div class="result-detail"><strong>Reversed Text:</strong> "${reverseString(cleaned)}"</div>
            </div>
        `;
    };

    const renderErrorResult = (errorMessage) => {
        DOM.outputDisplay.innerHTML = `
            <div class="result-box error">
                <div class="result-title" style="color: var(--error)">Validation Exception Caught</div>
                <div class="result-detail"><strong>Evaluated By:</strong> ${STUDENT_NAME} (${STUDENT_PRN})</div>
                <div class="result-detail"><strong>Error Message:</strong> ${errorMessage}</div>
            </div>
        `;
    };

    const updateAnalyticsUI = () => {
        const { totalChecks, palindromeCount, errorCount, history } = sessionTracker.getStats();

        DOM.statTotal.textContent = totalChecks;
        DOM.statPalindromes.textContent = palindromeCount;
        DOM.statErrors.textContent = errorCount;

        DOM.historyList.innerHTML = history.map(item => `
            <li class="history-item">
                <span><strong>"${item.text}"</strong> (${item.status})</span>
                <span style="color: var(--text-muted);">${item.time}</span>
            </li>
        `).join('');
    };

    // Initialization
    DOM.form.addEventListener('submit', (e) => {
        e.preventDefault();
        evaluateInput(DOM.textInput.value);
    });

    console.log(`[System Init] Palindrome Evaluator running for ${STUDENT_NAME} (PRN: ${STUDENT_PRN})`);

})());