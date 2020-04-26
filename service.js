// <script>
var cacheUI = 'UI-cache-20200414';
var cacheData = 'Data-cache-20200413';
var filesToCache = [
	'/',
	'/index.html',
	'/theme/css/reset.css',
	'/theme/css/article.css',
	'/theme/css/base.css',
	'/theme/css/index.css',
	'/theme/css/fonts/Icons.css',
	'/theme/css/fonts/Oswald.css',
	'/theme/css/fonts/Exo2.css',
	'/theme/js/persistence.js',
	'/theme/js/visited.js',
	'/images/galaxy.png.webp',
	'/images/galaxy.png'
];

// Start the service worker and cache all of the app's content
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(cacheUI)
			.then((cache) => (cache.addAll(filesToCache)))
	);
	self.skipWaiting();
});

// Serve cached content when offline
self.addEventListener('fetch', e => {
	if (e.request.url.includes('/forecast/')) {
		console.log('[Service Worker] Fetch (data)', e.request.url);
		e.respondWith(
			caches.open(cacheData).then((cache) => {
				return fetch(e.request)
					.then((response) => {
						// If the response was good, clone it and store it in the cache.
						if (response.status === 200) {
							cache.put(e.request.url, response.clone());
						}
						return response;
					}).catch((err) => {
						// Network request failed, try to get it from the cache.
						return cache.match(e.request);
					});
		}));
		return;
	}
	e.respondWith(
		caches.open(cacheUI).then((cache) => {
			return cache.match(e.request)
				.then((response) => {
					return response || fetch(e.request);
				});
		})
	);
	self.clients.claim();
});

self.addEventListener('activate', e => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== cacheUI && key !== cacheData) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}))
		})
	)
});

/*
self.addEventListener('message', e => {
	if (e.data === 'skipWaiting') return skipWaiting();
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service.js')
		.then((reg) => {
			console.log('Service worker registered.', reg);
		}, (error) => {
			console.log('Service worker registration failed:', error);
		});
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