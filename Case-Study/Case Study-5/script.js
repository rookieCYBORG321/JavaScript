/**
 * Practical: Arrays and Loops in JavaScript
 * Student: Parth Jani (PRN: 24070521241)
 */

// ==========================================
// PART A: BASIC ARRAY MANIPULATIONS
// ==========================================
let baseArray = [10, 20, 30, 40];

function updateArrayDisplay() {
    document.getElementById('arrayState').textContent = JSON.stringify(baseArray);
}

function logPartA(methodName, returnedVal) {
    document.getElementById('partAOutput').innerHTML = `
        > Executed Method: <strong>${methodName}</strong><br>
        > Return Value: <strong>${JSON.stringify(returnedVal)}</strong><br>
        > Modified Array: <strong>${JSON.stringify(baseArray)}</strong>
    `;
    updateArrayDisplay();
}

function demoPush() {
    const res = baseArray.push(50);
    logPartA("push(50)", res);
}

function demoPop() {
    const res = baseArray.pop();
    logPartA("pop()", res);
}

function demoShift() {
    const res = baseArray.shift();
    logPartA("shift()", res);
}

function demoUnshift(val) {
    const res = baseArray.unshift(val);
    logPartA(`unshift(${val})`, res);
}

function demoSplice() {
    const res = baseArray.splice(1, 1, 99);
    logPartA("splice(1, 1, 99)", res);
}

function demoSlice() {
    const res = baseArray.slice(1, 3);
    document.getElementById('partAOutput').innerHTML = `
        > Executed Method: <strong>slice(1, 3)</strong><br>
        > Extracted Array: <strong>${JSON.stringify(res)}</strong><br>
        > Original Array: <strong>${JSON.stringify(baseArray)}</strong>
    `;
}

// ==========================================
// PART B: ARRAY ITERATIVE METHODS
// ==========================================
const sampleNumbers = [1, 2, 3, 4, 5, 6];

function demoMap() {
    const mapped = sampleNumbers.map(x => x * 2);
    document.getElementById('partBOutput').innerHTML = `
        > map(x => x * 2)<br>
        > Result: <strong>[${mapped.join(', ')}]</strong>
    `;
}

function demoFilter() {
    const filtered = sampleNumbers.filter(x => x % 2 === 0);
    document.getElementById('partBOutput').innerHTML = `
        > filter(x => x % 2 === 0)<br>
        > Result: <strong>[${filtered.join(', ')}]</strong>
    `;
}

function demoReduce() {
    const sum = sampleNumbers.reduce((acc, curr) => acc + curr, 0);
    document.getElementById('partBOutput').innerHTML = `
        > reduce((acc, curr) => acc + curr, 0)<br>
        > Result Sum: <strong>${sum}</strong>
    `;
}

function demoForEach() {
    let logs = [];
    sampleNumbers.forEach((val, idx) => {
        logs.push(`[Index ${idx}]: ${val}`);
    });
    document.getElementById('partBOutput').innerHTML = `
        > forEach Execution Output:<br>
        > ${logs.join(' | ')}
    `;
}

// ==========================================
// CASE STUDY: MAXIMUM & MINIMUM VALUE FINDER
// ==========================================
function findMinMax(arr) {
    if (!arr || arr.length === 0) return { max: null, min: null };

    let maxVal = arr[0];
    let minVal = arr[0];

    // Loop iteration through array elements
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
        if (arr[i] < minVal) {
            minVal = arr[i];
        }
    }

    return { max: maxVal, min: minVal };
}

function calculateMinMax() {
    const inputStr = document.getElementById('customNumbers').value.trim();
    let arr = [25, 10, 45, 5, 30, 15]; // Default Case Study Array from prompt

    if (inputStr !== "") {
        const parsed = inputStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        if (parsed.length > 0) {
            arr = parsed;
        }
    }

    document.getElementById('caseArrayDisplay').textContent = `[${arr.join(', ')}]`;

    const { max, min } = findMinMax(arr);

    document.getElementById('minMaxResult').innerHTML = `
        <div><strong>Array:</strong> [${arr.join(', ')}]</div>
        <div style="margin-top: 8px;">
            <strong>Maximum Value:</strong> ${max} &nbsp;&nbsp;|&nbsp;&nbsp; 
            <strong>Minimum Value:</strong> ${min}
        </div>
    `;
}

// Automatically compute default Case Study on page load
document.addEventListener('DOMContentLoaded', () => {
    calculateMinMax();
});