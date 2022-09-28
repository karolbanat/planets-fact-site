const navToggleButton = document.querySelector('#primary-nav-toggle');

navToggleButton.addEventListener('click', (e) => {
	const buttonControlTarget = navToggleButton.dataset.controls;
	const controlsTarget = document.querySelector(buttonControlTarget);
	const prevExpanded = navToggleButton.getAttribute('aria-expanded') === 'true' ? true : false;
	navToggleButton.setAttribute('aria-expanded', !prevExpanded);
	controlsTarget.toggleAttribute('data-expanded', !prevExpanded);
});
