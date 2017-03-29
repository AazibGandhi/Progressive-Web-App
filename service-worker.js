var cacheName = 'cache_version3';
var cacheFiles = [
   'index.html'
];
self.addEventListener('install',function(e){
  //  console.log("[Service Worker] Installed");
   e.waitUntil(
       caches.open(cacheName).then(function(cache){
          //  console.log("[ServiceWorker] Caching cacheFiles");
           cache.addAll(cacheFiles);
       }).then(function() {
           return self.skipWaiting();
     })
   )
})

self.addEventListener('activate', function(e){
  //  console.log("[Service Worker] Activated");
   e.waitUntil(
    caches.keys().then(function(cacheNames){
     return Promise.all(cacheNames.map(function(thisCacheName){
     if(thisCacheName != cacheName)
     {
      // console.log("[Service Worker] Removing Cached Files from", thisCacheName);
      return caches.delete(thisCacheName);
     }
     }))
     }).then(function(){
       return self.clients.claim();
     })
   )
})

self.addEventListener('fetch',function(e){
  //  console.log("[Service Worker] Fetching REQUEST URL",e. request.url);
   e.respondWith(
   caches.match(e.request).then(function(resp) {
      //  console.log("Response from Cache",resp)
       return resp || fetch(e.request)
       .then(function(response) {
           return caches.open(cacheName).then(function(cache)
           {
            cache.put(e.request,response.clone());
            return response;
           });  
      });
   })
   .catch(function() {
     return console.log("Error Fallback");
   })
 );
})