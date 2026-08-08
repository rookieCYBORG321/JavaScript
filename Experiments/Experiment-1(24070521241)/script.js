/**
 * External JavaScript File - Practical 1
 */

// 1. Console Methods Demonstration
console.log("%c--- Practical 1 Executing ---", "color: #1e8437; font-weight: bold; font-size: 14px;");
console.info("External JS: script.js successfully loaded.");
console.warn("Console Warning: Demonstrating console methods.");
console.error("Console Error Demo: System check completed without errors.");

// 2. Student Information Object
const userProfile = {
    name: "Parth Jani",
    prn: "24070521241",
    status: "Active Student",
    batch: "2024-2028",
    semester: "Semester V"
};

// Table Console Logging
console.table(userProfile);

// Grouped Console Logs
console.group("System Diagnostic Logs");
console.log("Checking DOM loading state...");
console.log("Binding external button handlers...");
console.groupEnd();

// 3. DOM Dynamic Rendering
document.addEventListener('DOMContentLoaded', () => {
    const externalBtn = document.getElementById('externalBtn');
    const welcomeBanner = document.getElementById('welcomeBanner');
    const userInfoDisplay = document.getElementById('userInfoDisplay');

    // Time-based Welcome Greeting
    const hour = new Date().getHours();
    let greeting = "Welcome";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    welcomeBanner.textContent = `${greeting}, ${userProfile.name}! System Session Initialized.`;

    // Render Student Profile Details
    userInfoDisplay.innerHTML = `
        <div><strong>Student Name:</strong> ${userProfile.name}</div>
        <div><strong>PRN:</strong> ${userProfile.prn}</div>
        <div><strong>Status:</strong> ${userProfile.status}</div>
        <div><strong>Batch:</strong> ${userProfile.batch}</div>
        <div><strong>Semester:</strong> ${userProfile.semester}</div>
    `;

    // External Button Handler
    externalBtn.addEventListener('click', () => {
        alert(`External JS: Triggered for ${userProfile.name} from script.js file!`);
        console.log("External JS Button Clicked.");
    });
});