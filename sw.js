const C='bible-cache';
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const q=e.request;
  if(q.method!=='GET'||!q.url.startsWith(self.location.origin))return;
  const isPage=/(\/|index\.html)$/.test(new URL(q.url).pathname);
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(q,{ignoreSearch:true});
    const net=fetch(q,{cache:'no-cache'}).then(async r=>{
      if(r.ok){
        if(hit&&isPage){
          const [a,b]=await Promise.all([hit.clone().text(),r.clone().text()]);
          if(a!==b)(await self.clients.matchAll()).forEach(x=>x.postMessage('update'));
        }
        c.put(q,r.clone());
      }
      return r;
    }).catch(()=>null);
    return hit||net||new Response('오프라인 상태예요',{status:503});
  }));
});
