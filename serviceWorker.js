// Устанавливаем сервис-воркер
self.addEventListener('install', (event) => {
    console.log('Сервис-воркер установлен');
    
    // Важно, чтобы сервис-воркер был установлен только один раз и все ресурсы были закешированы
    event.waitUntil(
      caches.open('my-cache-v1').then((cache) => {
        return cache.addAll([
          '/Frontend/',                      // Главная страница
        '/Frontend/index.html',            // Индексный HTML
        '/Frontend/manifest.json',         // Манифест
        '/Frontend/logo192.png',           // Логотип
        '/Frontend/logo512.png',
        '/Frontend/images/default.png',
        '/Frontend/images/1.png',
        '/Frontend/images/2.png',
        '/Frontend/images/3.png',
        '/Frontend/images/4.png',
        '/Frontend/images/5.png',
        '/Frontend/images/6.png',          
        '/Frontend/src/main.tsx',          // Главный JS файл
        '/Frontend/src/index.css',         // CSS файл
          // Добавьте другие файлы, которые нужно кешировать для оффлайн-режима
        ]);
      })
    );
  });
  
  // Слушаем событие fetch (сеть)
  self.addEventListener('fetch', (event) => {
    // Ответ с кеша, если файл в кеше, иначе делаем запрос к сети
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Если файл есть в кеше — отдаем его
          return cachedResponse;
        }
        // Если нет — запрашиваем из сети
        return fetch(event.request);
      })
    );
  });
  
  // Обновление сервис-воркера (если потребуется)
  self.addEventListener('activate', (event) => {
    console.log('Сервис-воркер активирован');
    // Очистка старых кешей
    const cacheWhitelist = ['my-cache-v1']; // Убедитесь, что используете актуальную версию кеша
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName); // Удаляем старые кеши
            }
          })
        );
      })
    );
  });