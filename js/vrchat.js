import { initLoader, loadComponent } from './main.js';

initLoader();

await Promise.all([
	loadComponent("/html/header.html", "header", { content: { ".header-text": "Look at my Cool VRchat pictures hehe!" }}),
	loadComponent("/html/footer.html", "footer")
]).catch(console.error);



// Gallery
const Gallery = document.getElementById("gallery");
const MaxImage = 156;
const ImagePath = "../assets/vrchat/vrchat NUMBER.webp";

for (let ImageNumber = MaxImage; ImageNumber >= 1; ImageNumber--) {
	const Item = document.createElement("div");
	const Loader = document.createElement("div");
	const Water = document.createElement("div");
	const ImageElement = document.createElement("img");

	Item.className = "gallery-item";
	Loader.className = "gallery-loader";
	Water.className = "gallery-water";
	ImageElement.className = "enlargeable";
	ImageElement.alt = `VRChat image ${ImageNumber}`;

	Loader.appendChild(Water);
	Item.append(Loader, ImageElement);
	Gallery.appendChild(Item);
}

async function LoadImage(Item, ImageNumber, Index) {
	const Loader = Item.querySelector(".gallery-loader");
	const Water = Item.querySelector(".gallery-water");
	const ImageElement = Item.querySelector("img");

	try {
		const Response = await fetch(ImagePath.replace("NUMBER", ImageNumber));

		if (!Response.ok) {
			throw new Error(`Failed to load image ${ImageNumber}`);
		}

		const Total = parseInt(Response.headers.get("content-length")) || 0;
		const Reader = Response.body.getReader();
		const Chunks = [];
		let Loaded = 0;

		while (true) {
			const { done, value } = await Reader.read();

			if (done) break;

			Chunks.push(value);
			Loaded += value.length;

			if (Total) {
				Water.style.setProperty("--progress", `${Loaded / Total * 100}%`);
			}
		}

		const ImageData = new Blob(Chunks);
		ImageElement.src = URL.createObjectURL(ImageData);

		await ImageElement.decode();

		Water.style.setProperty("--progress", "100%");

		const Delay = Math.max(30, 300 * Math.pow(0.95, Index));
		await new Promise(Resolve => setTimeout(Resolve, Delay));

		Item.classList.add("loaded");
	} catch (Error) {
		console.error(`Image ${ImageNumber} failed:`, Error);
		Loader.remove();
	}
}

async function LoadImages() {
	for (let Index = 0; Index < Gallery.children.length; Index++) {
		await LoadImage(Gallery.children[Index], MaxImage - Index, Index);
	}
}

LoadImages();



// Initializing Buttons
document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".enlargeable").forEach((img) => {
		img.style.cursor = "url(/assets/cursor/pointer.png), pointer";
	});
});
