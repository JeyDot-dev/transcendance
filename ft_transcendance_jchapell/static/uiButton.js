const menuButton = document.querySelector('#menuButton');
const chatButton = document.querySelector('#chatButton');
const accountButton = document.querySelector('#accountButton');

let active = {
	menu: false,
	chat: false,
	account: false
};

menuButton.addEventListener('click', function() {
	toggleMenu();
	active.menu = !active.menu;
});

function toggleMenu() {
	if (active.menu) {
		menuButton.removeAttribute('style');
		return
	}
	menuButton.style.width = '30%';
	menuButton.style.height = '100%';
	menuButton.style.top = '0';
	menuButton.style.left = '0';
	menuButton.style.zIndex = '100';
	menuButton.style.borderRadius = '0';
	menuButton.style.borderTopRightRadius = '42px';
}

chatButton.addEventListener('click', function() {
	toggleChat();
	active.chat = !active.chat;
});

function toggleChat() {
	if (active.chat) {
		chatButton.removeAttribute('style');
		return
	}
	chatButton.style.width = '30%';
	chatButton.style.height = '50%';
	chatButton.style.bottom = '0';
	chatButton.style.right = '0';
	chatButton.style.zIndex = '100';
	chatButton.style.borderRadius = '0';
	chatButton.style.borderTopLeftRadius = '42px';
}

accountButton.addEventListener('click', function() {
	toggleAccount();
	active.account = !active.account;
});

function toggleAccount() {
	if (active.account) {
		accountButton.removeAttribute('style');
		return
	}
	accountButton.style.width = '20%';
	accountButton.style.height = '50%';
	accountButton.style.top = '0';
	accountButton.style.right = '0';
	accountButton.style.zIndex = '100';
	accountButton.style.borderRadius = '0';
	accountButton.style.borderBottomLeftRadius = '42px';
}