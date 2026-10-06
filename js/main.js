async function loadComponent(filePath, targetId, { content = {}, afterLoad } = {}) {
	const response = await fetch(filePath);
	if (!response.ok) throw new Error(`Could not load ${filePath} (${response.status})`);

	const target = document.getElementById(targetId);
	if (!target) throw new Error(`Could not find the component target #${targetId}`);

	target.innerHTML = await response.text();

	for (const [selector, value] of Object.entries(content)) {
		const element = target.querySelector(selector);
		if (!element) throw new Error(`Could not find ${selector} inside ${filePath}`);
		element.textContent = value;
	}

	afterLoad?.(target);
	return target;
}
