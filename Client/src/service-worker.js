import { precacheAndRoute } from 'workbox-precaching'
precacheAndRoute(self.__WB_MANIFEST)

let cacheName="v1"


// installing service worker
self.addEventListener("install", e=>{
    console.log('service Worker : installed');
});

//Call Activate Event
self.addEventListener('activate',e => {
    console.log("Service Worker: Activated")
});

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .then(res =>{
                const resClone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, resClone);
                    }).catch(error => console.log(error));
                    return res;
            })
            .catch((err)=> caches.match(e.request)).then(res => res)
    )
});
