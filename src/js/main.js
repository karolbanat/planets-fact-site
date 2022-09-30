const navToggleButton = document.querySelector('#primary-nav-toggle');
const primaryNav = document.querySelector('#primary-nav');

const planetLinks = document.querySelectorAll('a[data-planet]');
const planetFactsBody = document.querySelector('.planet-facts');
const planetImage = planetFactsBody.querySelector('#planet-image');
const planetGeologyImage = planetFactsBody.querySelector('#geology-image');
const planetHeading = planetFactsBody.querySelector('#planet-heading');
const planetContent = planetFactsBody.querySelector('#planet-description');
const planetSourceLink = planetFactsBody.querySelector('#source-link');
const controlButtons = planetFactsBody.querySelectorAll('.control-button[data-controls]');
const planetFactsData = planetFactsBody.querySelectorAll('[data-fact]');

const ANIMATION_CLASSES = {
	fadeLeft: 'animation-fade-left',
	fadeIn: 'animation-fade-in',
};

let currentPlanet = {};

/* loading planet data */
const loadPlanetData = async (planet = 'mercury') => {
	try {
		currentPlanet = await getPlanetData(planet);
		planetFactsBody.dataset.planet = planet;
		loadPlanetImage();
		loadGeologyImage();
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
	toggleGeologyImageView(topic);
	animateElement(planetImage, ANIMATION_CLASSES.fadeLeft);
};

const toggleGeologyImageView = (topic) => {
	const shouldShow = topic === 'geology';
	planetGeologyImage.classList.toggle('visible', shouldShow);
};

const loadGeologyImage = () => {
	planetGeologyImage.src = currentPlanet.images.geology;
};

const loadPlanetHeading = () => {
	planetHeading.innerText = currentPlanet.name;
};

const loadContent = (topic = 'overview') => {
	const { content, source } = currentPlanet[topic];
	planetContent.innerText = content;
	animateElement(planetContent, ANIMATION_CLASSES.fadeIn);
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
	toggleGeologyImageView(topic);
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
	const prevExpanded = navToggleButton.getAttribute('aria-expanded') === 'true' ? true : false;
	navToggleButton.setAttribute('aria-expanded', !prevExpanded);
	primaryNav.toggleAttribute('data-expanded', !prevExpanded);
};

/* handler for navigation link */
const handlePlanetLink = (e) => {
	const planet = e.target.dataset.planet;
	loadPlanetData(planet);
	handleActiveLink(e.target);
	handleNavToggle(); // closing nav after clicking link
};

const handleActiveLink = (activeLink) => {
	planetLinks.forEach((link) => link.classList.remove('active'));
	activeLink.classList.add('active');
};

/* animation helper */
const animateElement = (element, animationName) => {
	element.classList.add(animationName);
	const endAnimation = () => {
		element.classList.remove(animationName);
		element.removeEventListener('animationend', endAnimation);
	};
	element.addEventListener('animationend', endAnimation);
};

/* event listeners */
navToggleButton.addEventListener('click', handleNavToggle);
planetLinks.forEach((link) => {
	link.addEventListener('click', handlePlanetLink);
});
controlButtons.forEach((button) => {
	button.addEventListener('click', handleControlButton);
});

loadPlanetData();
