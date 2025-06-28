// กำหนดชื่อสำหรับแคช
const CACHE_NAME = 'moodao-cache-v1';

// รายการไฟล์และ asset ทั้งหมดที่จะแคช
const urlsToCache = [
    '/',
    'index.html',
    'exercise.html',
    'stats.html',
    'style.css',
    'manifest.json',
    'data/questions.json',
    'js/main.js',
    'js/game.js',
    'js/stats.js',
    'images/moodao-character.png',
    'images/icon-192.png',
    'images/icon-512.png',
    'images/ursa1.png',
    'images/ursa2.png',
    'images/orion.png',
    'sounds/correct.mp3',
    'sounds/incorrect.mp3',
    'sounds/bg-music.mp3',
    'https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Mali&family=Kanit:wght@400;700&display=swap'
];

// --- Event Listeners ---

// 1. Install Event: แคชไฟล์ทั้งหมดที่ระบุไว้
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Fetch Event: ให้บริการเนื้อหาที่แคชไว้เมื่อออฟไลน์
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // ถ้าคำขออยู่ในแคช ให้ส่งกลับไป
                if (response) {
                    return response;
                }
                // มิฉะนั้น ให้ดึงจากเครือข่าย
                return fetch(event.request);
            })
    );
});

// 3. Activate Event: ล้างแคชเก่าๆ ที่ไม่ได้ใช้แล้ว
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});