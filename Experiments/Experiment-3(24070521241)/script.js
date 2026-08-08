/**
 * Practical 3: Control Structures & Form Validation (Grading System)
 */
const GradeCalculator = (() => {
    // Subject Mapping
    const subjects = [
        { id: 'sub1', name: 'Web Technologies' },
        { id: 'sub2', name: 'Data Structures' },
        { id: 'sub3', name: 'Database Management Systems' },
        { id: 'sub4', name: 'Computer Networks' },
        { id: 'sub5', name: 'Operating Systems' }
    ];

    // DOM Elements Cache
    const DOM = {
        form: document.getElementById('gradeForm'),
        output: document.getElementById('gradeOutput')
    };

    // Form Validation (Loops & Conditionals)
    const validateForm = () => {
        let isValid = true;

        for (let sub of subjects) {
            const inputEl = document.getElementById(sub.id);
            const errorEl = inputEl.nextElementSibling;
            const val = parseFloat(inputEl.value);

            // Validation Control Structure
            if (isNaN(val) || val < 0 || val > 100) {
                errorEl.style.display = 'block';
                inputEl.style.borderColor = 'var(--error)';
                isValid = false;
            } else {
                errorEl.style.display = 'none';
                inputEl.style.borderColor = 'var(--border)';
            }
        }

        return isValid;
    };

    // Determine Subject Grade (if-else if ladder)
    const getSubjectGrade = (marks) => {
        if (marks >= 90) return { grade: 'O', label: 'Outstanding', class: 'grade-A' };
        else if (marks >= 80) return { grade: 'A+', label: 'Excellent', class: 'grade-A' };
        else if (marks >= 70) return { grade: 'A', label: 'Very Good', class: 'grade-B' };
        else if (marks >= 60) return { grade: 'B+', label: 'Good', class: 'grade-B' };
        else if (marks >= 50) return { grade: 'B', label: 'Above Average', class: 'grade-C' };
        else if (marks >= 40) return { grade: 'P', label: 'Pass', class: 'grade-C' };
        else return { grade: 'F', label: 'Fail', class: 'grade-F' };
    };

    // Determine Overall Class Performance (switch statement)
    const getAcademicClassification = (percentage, hasFailed) => {
        if (hasFailed) return "Failed (Re-examination Required)";

        const scoreBracket = Math.floor(percentage / 10);

        switch (scoreBracket) {
            case 10:
            case 9:
            case 8:
                return "First Class with Distinction";
            case 7:
                return "First Class";
            case 6:
                return "Higher Second Class";
            case 5:
                return "Second Class";
            case 4:
                return "Pass Class";
            default:
                return "Unclassified";
        }
    };

    // Render Grade Card Output
    const renderGradeSheet = () => {
        let totalMarks = 0;
        let hasFailed = false;
        let tableRowsHtml = '';

        subjects.forEach(sub => {
            const marks = parseFloat(document.getElementById(sub.id).value);
            const gradeInfo = getSubjectGrade(marks);

            totalMarks += marks;
            if (gradeInfo.grade === 'F') hasFailed = true;

            tableRowsHtml += `
                <tr>
                    <td>${sub.name}</td>
                    <td>${marks} / 100</td>
                    <td><span class="grade-badge ${gradeInfo.class}">${gradeInfo.grade} (${gradeInfo.label})</span></td>
                </tr>
            `;
        });

        const percentage = (totalMarks / (subjects.length * 100)) * 100;
        const classification = getAcademicClassification(percentage, hasFailed);

        DOM.output.innerHTML = `
            <div class="result-box">
                <table class="subject-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Marks</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>

                <div class="summary-block">
                    <div class="summary-row"><span>Student Name:</span> <span><strong>Arpeet Patel</strong></span></div>
                    <div class="summary-row"><span>Student PRN:</span> <span><strong>24070521241</strong></span></div>
                    <div class="summary-row"><span>Total Score:</span> <span>${totalMarks} / 500</span></div>
                    <div class="summary-row"><span>Percentage:</span> <span>${percentage.toFixed(2)}%</span></div>
                    <div class="summary-row total-row"><span>Result:</span> <span>${hasFailed ? 'FAIL' : 'PASS'}</span></div>
                    <div class="summary-row"><span>Classification:</span> <span><strong>${classification}</strong></span></div>
                </div>
            </div>
        `;
    };

    return {
        init: () => {
            DOM.form.addEventListener('submit', (e) => {
                e.preventDefault();

                if (validateForm()) {
                    renderGradeSheet();
                }
            });
        }
    };
})();

// Initialize Module on DOM Loaded
document.addEventListener('DOMContentLoaded', GradeCalculator.init);