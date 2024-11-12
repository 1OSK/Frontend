// Устанавливаем сервис-воркер
self.addEventListener('install', (event) => {
    console.log('Сервис-воркер установлен');
    
    // Важно, чтобы сервис-воркер был установлен только один раз и все ресурсы были закешированы
    event.waitUntil(
      caches.open('my-cache-v1').then((cache) => {
        return cache.addAll([
          './',                        // Главная страница
          './index.html',              // Индексный HTML
          './manifest.json',           // Манифест
          './logo192.png',             // Логотип
          './images/1.png',
          './images/2.png',
          './images/3.png',
          './images/4.png',
          './images/5.png',
          './images/6.png',
          './images/default.png',
          './logo512.png',             // Логотип
          './src/main.tsx',            // Главный JS файл
          './src/index.css',           // CSS файл
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