import { initLoader, loadComponent } from './main.js';

initLoader();

await Promise.all([
	loadComponent("/html/header.html", "header", {content: { ".header-text": "Everything about my website and boring legal stuff!" }}),
	loadComponent("/html/footer.html", "footer")
]).catch(console.error);



// Expand License
function toggleLicense() {
    const details = document.getElementById("license-details");
    const button = document.getElementById("license-toggle");
    const isOpen = details.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen);
    button.textContent = isOpen ? "Show less" : "Show full license";
}



// Initializing Buttons
function initializeButtons() {
	const licenseButton = document.getElementById("license-toggle");
    if (licenseButton) {
        licenseButton.addEventListener("click", toggleLicense);
    }
}

initializeButtons();
