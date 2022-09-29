const navToggleButton = document.querySelector('#primary-nav-toggle');

const planetLinks = document.querySelectorAll('a[data-planet]');
const planetFactsBody = document.querySelector('.planet-facts');
const planetImage = planetFactsBody.querySelector('#planet-image');
const planetHeading = planetFactsBody.querySelector('#planet-heading');
const planetContent = planetFactsBody.querySelector('#planet-description');
const planetSourceLink = planetFactsBody.querySelector('#source-link');
const controlButtons = planetFactsBody.querySelectorAll('.control-button[data-controls]');
const planetFactsData = planetFactsBody.querySelectorAll('[data-fact]');

let currentPlanet = {};

const loadPlanetData = async (planet = 'mercury') => {
	try {
		currentPlanet = await getPlanetData(planet);
		loadPlanetImage();
		loadPlanetHeading();
		loadContent();
		loadFactsData();
		deselectControlButtons();
		controlButtons[0].classList.add('active'); //select overview button
	} catch (error) {}
};

const getPlanetData = async (planet = 'mercury') => {
	try {
		const res = await fetch('./data.json');
		const data = await res.json();
		return data.filter((p) => p.name.toLowerCase() === planet)[0];
	} catch (error) {
		return {};
	}
};

const loadPlanetImage = (topic = 'overview') => {
	const imageSrc = topic === 'structure' ? currentPlanet.images.internal : currentPlanet.images.planet;
	planetImage.src = imageSrc;
};

const loadPlanetHeading = () => {
	planetHeading.innerText = currentPlanet.name;
};

const loadContent = (topic = 'overview') => {
	const { content, source } = currentPlanet[topic];
	planetContent.innerText = content;
	planetSourceLink.href = source;
};

const loadFactsData = () => {
	planetFactsData.forEach((data) => {
		const fact = data.dataset.fact;
		const factData = currentPlanet[fact];
		data.innerText = factData;
	});
};

/* handle for control buttons */
const handleControlButton = (e) => {
	const topic = e.target.dataset.controls;
	loadContent(topic);
	loadPlanetImage(topic);
	deselectControlButtons();
	e.target.classList.add('active');
};

const deselectControlButtons = () => {
	controlButtons.forEach((button) => {
		button.classList.remove('active');
	});
};

/* handler navigation toggle */
const handleNavToggle = () => {
	const buttonControlTarget = navToggleButton.dataset.controls;
	const controlsTarget = document.querySelector(buttonControlTarget);
	const prevExpanded = navToggleButton.getAttribute('aria-expanded') === 'true' ? true : false;
	navToggleButton.setAttribute('aria-expanded', !prevExpanded);
	controlsTarget.toggleAttribute('data-expanded', !prevExpanded);
};

/* event listeners */
navToggleButton.addEventListener('click', handleNavToggle);
planetLinks.forEach((link) => {
	link.addEventListener('click', (e) => {
		const planet = e.target.dataset.planet;
		loadPlanetData(planet);
	});
});
controlButtons.forEach((button) => {
	button.addEventListener('click', handleControlButton);
});

loadPlanetData();
