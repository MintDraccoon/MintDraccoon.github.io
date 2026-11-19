// Loader
export function initLoader() {
	const Loader = document.getElementById("loader");
	if (!Loader) return;

	let IsHidden = false;

	const RemoveLoader = () => Loader.remove();

	const HideLoader = () => {
		if (IsHidden) return;
		IsHidden = true;

		Loader.classList.add("fade-out");
		Loader.addEventListener("transitionend", RemoveLoader, { once: true });

		setTimeout(RemoveLoader, 1500);
	};

	const SafetyTimer = setTimeout(HideLoader, 1500);

	if (document.readyState === "complete") {
		clearTimeout(SafetyTimer);
		HideLoader();
	} else {
		window.addEventListener("load", () => {
			clearTimeout(SafetyTimer);
			HideLoader();
		}, { once: true });
	}
}



// Load Components
const ComponentCache = new Map();

export async function loadComponent(FilePath, TargetId, { Content = {}, AfterLoad } = {}) {
	const Target = document.getElementById(TargetId);

	if (!Target) {throw new Error(`[Components] Target #${TargetId} not found`);}

	try {
		let HTML = ComponentCache.get(FilePath);

		if (HTML === undefined) {
			const Response = await fetch(FilePath);

			if (!Response.ok) {throw new Error(`${Response.status} ${Response.statusText}`);}

			HTML = await Response.text();
			ComponentCache.set(FilePath, HTML);
		}

		Target.innerHTML = HTML;

		for (const [Selector, Data] of Object.entries(Content)) {
			const Element = Target.querySelector(Selector);

			if (!Element) {throw new Error(`Element "${Selector}" not found in ${FilePath}`);}

			if (typeof Data === "object" && Data !== null && "html" in Data) {
				Element.innerHTML = Data.html;
			} else {
				Element.textContent = Data;
			}
		}

		await AfterLoad?.(Target);

		return Target;
	} catch (Error) {console.error(`[Components] Failed to load ${FilePath}:`, Error); throw Error;}
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

		overlay.addEventListener("click", () => {overlay.remove();});
	});
}
