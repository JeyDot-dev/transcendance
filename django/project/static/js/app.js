const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: "/api/home/" },
		{ path: "/pong", view: "/api/pong/" },
		{ path: "/pong/game", view: "/api/pong/game/" },
		{ path: "/about", view: "/api/about/" },
		{ path: "/test", view: "/api/test/" }
	];

	const path = location.pathname.endsWith("/") && location.pathname.length > 1
		? location.pathname.slice(0, -1)
		: location.pathname;

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			isMatch: path === route.path
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
