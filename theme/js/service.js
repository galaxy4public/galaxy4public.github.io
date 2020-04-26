/*
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service.js')
			.then((reg) => {
				console.log('Service worker registered.', reg);
			}, (error) => {
				console.log('Service worker registration failed:', error);
			});
	});
} else {
  console.log('Service workers are not supported.');
}
*/
