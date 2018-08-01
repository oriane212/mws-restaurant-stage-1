/*
Service worker script
    * When available in the browser, the site uses this service worker to cache responses to requests for site assets
    * Visted pages are rendered when there is no network access
*/

let staticCacheName = 'restaurant-reviews-v1';

/* Handle service worker installation and cache responses to requests for site assets */
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                './css/styles.css',
                './css/small.css',
                './css/medium.css',
                './data/restaurants.json',
                './img/1.jpg',
                './img/2.jpg',
                './img/3.jpg',
                './img/4.jpg',
                './img/5.jpg',
                './img/6.jpg',
                './img/7.jpg',
                './img/8.jpg',
                './img/9.jpg',
                './img/10.jpg',
                './js/dbhelper.js',
                './js/main.js',
                './js/restaurant_info.js',
                './',
                './offline.html',
                './restaurant.html'
            ])
        })
    )
})

/* Handle new service worker activation with updated cached site assets */
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurant-reviews-') && cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return cache.delete(cacheName);
                })
            )
        })
    )
})

/* Handle service worker fetch events with matching request to cached response or displaying offline message if unavailable */
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) return response;
            return fetch(event.request);
        }).catch(function() {
            fetch('./offline.html');
        })
    )
})

