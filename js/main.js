// Loader
export function initLoader() {
	const loader = document.getElementById("loader");
	if (!loader) return;

	const hideLoader = () => {
		if (loader.classList.contains("fade-out")) return;
		loader.classList.add("fade-out");
		loader.addEventListener("transitionend", () => {
			loader.remove();
		}, { once: true });
	};

	const safetyTimer = setTimeout(hideLoader, 1500);

	if (document.readyState === "complete") {
		clearTimeout(safetyTimer);
		hideLoader();
	} else {
		window.addEventListener("load", () => {
			clearTimeout(safetyTimer);
			hideLoader();
		}, { once: true });
	}
}



// Load Components
export async function loadComponent(filePath, targetId, { content = {}, afterLoad } = {}) {
	const response = await fetch(filePath);
	if (!response.ok) throw new Error(`Could not load ${filePath} (${response.status})`);

	const target = document.getElementById(targetId);
	if (!target) throw new Error(`Could not find the component target #${targetId}`);

	target.innerHTML = await response.text();

	for (const [selector, data] of Object.entries(content)) {
		const element = target.querySelector(selector);
		if (!element) throw new Error(`Could not find ${selector} inside${filePath}`);

		if (typeof data === "object" && data.html) {
			element.innerHTML = data.html;
		} else {
			element.textContent = data;
		}
	}

	afterLoad?.(target);
	return target;
}



// Enlargeable
export function initEnlargeable() {
	document.addEventListener("click", (event) => {
		const img = event.target.closest(".enlargeable");
		if (!img) return;

		const overlay = document.createElement("div");
		overlay.classList.add("img-overlay");

		const bigImg = document.createElement("img");
		bigImg.src = img.src;
		bigImg.alt = img.alt;
		bigImg.classList.add("img-popup");

		overlay.appendChild(bigImg);
		document.body.appendChild(overlay);

		overlay.addEventListener("click", () => {
			overlay.remove();
		});
	});
}
