const CACHE_NAME = "epi-cache-v2";
const assests = [
    "./",
    "./index.html",
    "./estilo.css",
    "./logica.js",
    "./manifest.json"
];

//Agora vou instalar o Service Worker e guardar os arquivos no cache do celular
self.addEventListener("install", evento => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assests);
        })
    );
});

//Aqui responde com os arquivos ja salvos caso o celular esteja sem internet.
self.addEventListener("fetch", evento => {
    evento.respondWith(
        caches.match(evento.request).then(resposta => {
            return resposta || fetch(evento.request);
        })
    );
});