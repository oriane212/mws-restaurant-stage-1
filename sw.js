/*
Service worker script
    * When available in the browser, the site uses this service worker to cache responses to requests for site assets
    * Visted pages are rendered when there is no network access
*/

let staticCacheName = 'restaurant-reviews-v1';

/* Handle service worker installation and cache responses to requests for site assets */
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
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
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-reviews-') && cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return cache.delete(cacheName);
                })
            )
        })
    )
})

/* Handle service worker fetch events with matching request to cached response */
self.addEventListener('fetch', function (event) {

    let mapUrl = 'https://api.tiles.mapbox.com/v4/mapbox.streets/';

    // Cache all map api related requests as they are made (code block reference https://samdutton.github.io/ilt/pwa/data/)
    if (event.request.url.indexOf(mapUrl) === 0) {
        event.respondWith(
            fetch(event.request)
                .then(function (response) {
                    return caches.open(staticCacheName).then(function (cache) {
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                })
        );
    // return matching cache when offline and display offline message if failed
    } else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            }).catch(function () {
                fetch('./offline.html');
            })
        )
    }
})

