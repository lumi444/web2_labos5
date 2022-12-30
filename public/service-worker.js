self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open('static')
  .then(function(cache){
    cache.add('/');
    cache.add('/index.html');
    cache.add('/cat.png');
    cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
    cache.add('/images/doggo.png');
    
    /*cache.addAll([
      '/',
      '/index.html',
      '/images/doggo.png'
    ])*/
    
  })
  )
  
  
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  
});

self.addEventListener('fetch',function(event){
  event.respondWith(
    caches.match(event.request)
    .then(function(res){
      if(res){
        return res;
      }else{
        return fetch(event.request);
      }
    })
  );
});

self.addEventListener('sync', function (event) {
  console.log('Background sync!', event);
  if (event.tag === 'sync-snaps') {
      event.waitUntil(
          syncSnaps()
      );
  }
});

let syncSnaps = async function () {
  entries()
      .then((entries) => {
          entries.forEach((entry) => {
              let snap = entry[1]; //  Each entry is an array of [key, value].
              let formData = new FormData();
              formData.append('id', snap.id);
              formData.append('ts', snap.ts);
              formData.append('title', snap.title);
              formData.append('image', snap.image, snap.id + '.png');
              fetch('/saveSnap', {
                      method: 'POST',
                      body: formData
                  })
                  .then(function (res) {
                      if (res.ok) {
                          res.json()
                              .then(function (data) {
                                  console.log("Deleting from idb:", data.id);
                                  del(data.id);
                              });
                      } else {
                          console.log(res);
                      }
                  })
                  .catch(function (error) {
                      console.log(error);
                  });
          })
      });
}


