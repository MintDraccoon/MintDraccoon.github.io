import { initLoader, loadComponent, initEnlargeable } from './main.js';
import { raccoons } from './raccoons.js';

initLoader();
initEnlargeable();

await Promise.all([
	loadComponent("/html/header.html", "header", { afterLoad: (header) => { setUpHeaderPfpControls(header); } }),
	loadComponent("/html/footer.html", "footer"),
]).catch(console.error);



// Header PFP Controls
function setUpHeaderPfpControls(header) {
	const emoji1 = header.querySelector(".header-emoji1");
	const emoji2 = header.querySelector(".header-emoji2");
	const pfpImg = document.querySelector(".about-box img");

	if (!emoji1 || !emoji2 || !pfpImg) return;

	emoji1.addEventListener("click", () => {
		if (pfpImg.src.includes("pfp.webp")) {
			pfpImg.src = "/assets/minty/fototeta.webp";
		} else {
			pfpImg.src = "/assets/minty/pfp.webp";
		}
	});

	emoji2.addEventListener("click", () => {
		pfpImg.classList.toggle("rainbow-hue");
	});
}



// Box Wobble Toggle
function boxWobbleToggle() {
	const Button = document.getElementById("wobble-btn");

	if (!Button) return;

	const Disabled = document.body.classList.toggle("no-wobble");

	Button.textContent = Disabled ? "Enable Wobble" : "Disable Wobble";
}

document.getElementById("wobble-btn")?.addEventListener("click", boxWobbleToggle);



// Greeting
const greetingText = document.getElementById("greeting-text");
if (greetingText) {
	const hour = new Date().getHours();
	const greetings = [
		[5, "Why are you still awake, night creature? 💤"],
		[12, "Good morning, sleepy trashpanda! ☕"],
		[18, "Good afternoon, hope you're causing chaos~ ✨"],
		[22, "Good evening, raccoon adventurer! 🌌"],
		[24, "Late again? Grab a snack and chill 🍿"]
	];
	greetingText.textContent = greetings.find(([limit]) => hour < limit)[1];
}



// Raccoon Facts
const factElement = document.getElementById("raccoonFact");
if (factElement) {
	const facts = [
		"Raccoons can rotate their hind feet 180° to climb down trees headfirst.",
		"They have highly sensitive front paws that can detect textures underwater.",
		"A group of raccoons is sometimes called a 'nursery' or a 'gaze'.",
		"Raccoons can remember solutions to tasks for at least 3 years!",
		"Their Latin name 'Procyon lotor' means 'before the dog, the washer'.",
		"Urban raccoons have learned to open doors, jars, and even simple latches.",
		"They can make over 50 different vocal sounds.",
		"Raccoons sometimes 'wash' their food to better feel its texture.",
		"Baby raccoons are called kits.",
		"Raccoons have an excellent sense of touch, often more important than sight or hearing.",
		"They have 5 fingers on each paw and their dexterity rivals some primates.",
		"Raccoons were sent into space as test animals in early experiments.",
		"In Japan, raccoons became popular pets after the 'Araiguma Rasukaru' cartoon in the 1970s.",
		"They can climb brick walls and even enter attics if motivated by hunger.",
		"The dark markings on their faces may help reduce glare and improve night vision.",
		"Despite being mostly solitary, raccoons sometimes share dens in winter.",
		"Raccoons have a specialized 'thumb' on their front paws for fine manipulation.",
		"They are omnivores and will eat almost anything, from fruits to small animals.",
		"Raccoons are excellent swimmers and can cross rivers or lakes if needed.",
		"The word 'raccoon' comes from the Powhatan Native American word 'aroughcun', meaning 'animal that scratches with its hands'.",
		"They can survive falls from heights of over 10 meters thanks to their agility.",
		"Raccoons have been observed using tools in captivity.",
		"Some raccoons have adapted to live entirely in urban areas without entering forests.",
		"They communicate using facial expressions, body posture, and tail position.",
		"During cold winters, raccoons can sleep for weeks without waking, although they do not truly hibernate.",
		"A raccoon's sense of touch improves when its paws are wet.",
		"Raccoons can live up to 20 years in captivity, but typically 5-7 years in the wild.",
		"They are mostly nocturnal, being most active during the night."
	];
	factElement.textContent = facts[new Date().getDate() % facts.length];
}



// Raccoons
const imageElement = document.getElementById("image-img");
const imageText = document.querySelector(".image-box-subtext");
const imageLoader = document.getElementById("image-loader");
const nextImageButton = document.getElementById("next-img-btn");

function getImageInfo(filename) {
	const [, platform = "unknown", id = "—"] = filename.match(/^(.+?)_(.+?)\.[^.]+$/) || [];
	return { platform, id };
}

function nextImg() {
	if (!imageElement || !imageLoader || !nextImageButton) return;

	const filename = raccoons[Math.floor(Math.random() * raccoons.length)];
	const { platform, id } = getImageInfo(filename);
	const image = new Image();

	imageLoader.style.display = "flex";
	imageElement.style.opacity = "0.3";
	nextImageButton.disabled = true;

	image.onload = () => {
		imageElement.src = image.src;
		imageText.textContent = `Platform: ${platform} — ID: ${id}`;
		imageLoader.style.display = "none";
		imageElement.style.opacity = "1";
		nextImageButton.disabled = false;
	};

	image.onerror = () => {
		imageText.textContent = "Failed to load image. ⚠️";
		imageLoader.style.display = "none";
		imageElement.style.opacity = "1";
		nextImageButton.disabled = false;
	};

	image.src = `/assets/raccoons/${filename}`;
}



// IP Joke
const ipElement = document.getElementById("ip");
if (ipElement) {
	fetch("/api/ip", { cache: "no-store" })
		.then(response => {
			if (!response.ok) throw new Error("Could not get IP");
			return response.json();
		})
		.then(async ({ ip, type }) => {
			if (!ip || !type) {
				throw new Error("No IP available");
			}

			if (type === "ipv4") {
				ipElement.textContent = ip;
				return;
			}

			if (type === "ipv6") {
				try {
					const response = await fetch("https://api4.ipify.org?format=json", { cache: "no-store" });
					if (!response.ok) throw new Error("ipify failed");

					const data = await response.json();
					if (data.ip) {
						ipElement.textContent = data.ip;
						return;
					}
				} catch (error) {
					console.log("Could not get IPv4 from ipify:", error);
				}

				ipElement.textContent = ip;
				return;
			}

			throw new Error("Unknown IP type");
		})
		.catch(() => {
			ipElement.textContent = "No IP available";
		});
}



// Initializing Buttons
function initializeButtons() {
	const wobbleBtn = document.getElementById("wobble-btn");
	if (wobbleBtn) {
		wobbleBtn.addEventListener("click", boxWobbleToggle);
	}

	if (nextImageButton) {
		nextImageButton.addEventListener("click", nextImg);
		nextImg();
	}

	document.querySelectorAll(".enlargeable").forEach((img) => {
		img.style.cursor = "url(/assets/cursor/pointer.png), pointer";
	});
}

initializeButtons();
