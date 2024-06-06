const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: "pages/home.html" },
		{ path: "/game", view: "pages/game.html" },
		{ path: "/about", view: "pages/about.html" },
		{ path: "/test", view: "pages/test.html"}
	];

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			isMatch: location.pathname === route.path
		};
	});

	let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

	if (!match) {
		match = {
			route: routes[0],
			isMatch: true
		};
	}

	const html = await fetch(match.route.view).then(response => response.text());
	document.querySelector("main").innerHTML = html;
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			if (e.target.href !== window.location.href) {
				navigateTo(e.target.href);
			}
		}
	});

	router();
});
