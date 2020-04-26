var config = {
	menu: false,
}

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return e instanceof DOMException && (
			// everything except Firefox
			e.code === 22 ||
			// Firefox
			e.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length !== 0);
	}
}

function save(event)
{
	config.menu = document.getElementById('menu-toggle').checked;
	if (storageAvailable('localStorage'))
		sessionStorage.setItem("config", JSON.stringify(config));
}

function restore(event)
{
	if (storageAvailable('localStorage'))
		result = sessionStorage.getItem("config");
	if (result) {
		config = JSON.parse(result);
		document.getElementById('menu-toggle').checked = config.menu;
	}
}

window.addEventListener('pageshow', restore);
//window.addEventListener('DOMContentLoaded', restore);
window.addEventListener('pagehide', save);
