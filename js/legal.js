loadComponent("/html/header.html", "header", {content: { ".header-text": "Everything about my website and boring legal stuff!" }}).catch(console.error);
loadComponent("/html/footer.html", "footer", {}).catch(console.error);

function toggleLicense() {
	const details = document.getElementById("license-details");
	const button = document.getElementById("license-toggle");
	const isOpen = details.classList.toggle("is-open");
	button.setAttribute("aria-expanded", isOpen);
	button.textContent = isOpen ? "Show less" : "Show full license";
}
