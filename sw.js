/* Рельеф: работа без интернета. При обновлении приложения меняй номер версии. */
const C='relief-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||!r.url.startsWith('http'))return;
 const net=fetch(r).then(async res=>{if(res&&(res.ok||res.type==='opaque')){const c=await caches.open(C);await c.put(r,res.clone())}return res}).catch(()=>null);
 e.waitUntil(net);
 e.respondWith(caches.match(r,{ignoreSearch:true})
  .then(hit=>hit||(r.mode==='navigate'?caches.match('./index.html'):null))
  .then(hit=>hit||net.then(res=>res||new Response('Нет сети',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}))));
});
