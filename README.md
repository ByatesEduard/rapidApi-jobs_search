rapidApi-jobs_search
[https://rapid-api-jobs-search-f7xg.vercel.app/register](https://rapid-api-jobs-search.vercel.app/) - backend
https://rapid-api-jobs-search-f7xg.vercel.app/ - frontend


Цей проєкт є фронтенд-частиною застосунку для пошуку вакансій, що використовує API від RapidAPI. Він дозволяє користувачам шукати роботу, переглядати деталі вакансій, зберігати вподобані пропозиції та створювати профіль.

 Структура проєкту
rapidApi-jobs_search/
├── client/          # Фронтенд (React)
│   ├── components/  # UI компоненти
│   ├── pages/       # Сторінки
│   ├── redux/       # Стан додатку
│   └── utils/       # Утиліти
└── server/          # Бекенд (Express)
    ├── controllers/ # Логіка обробки запитів
    ├── models/      # Моделі MongoDB
    └── routes/      # Маршрути API

 Технології

Фронтенд:

React

TypeScript

Tailwind CSS

Formik + Yup

Axios + SWR

Chakra UI

Бекенд:

Express.js

MongoDB

Mongoose

 Як запустити проєкт
1. Клонування репозиторію
git clone https://github.com/ByatesEduard/rapidApi-jobs_search.git
cd rapidApi-jobs_search

2. Налаштування клієнтської частини
cd client
npm install
npm run dev

3. Налаштування серверної частини
cd ../server
npm install
npm run start

 API

Використовується безкоштовне API для пошуку вакансій:

Базовий URL: https://jsearch.p.rapidapi.com/search

Параметри:

query: Назва вакансії

location: Місто

page: Номер сторінки

 Функціональність

Пошук вакансій: Користувач може шукати вакансії за назвою .

Деталі вакансії: Кожна вакансія має окрему сторінку з детальною інформацією.

Вподобані вакансії: Користувач може додавати вакансії до списку вподобаних, який зберігається в LocalStorage.

Профіль користувача: Користувач може створити профіль з ім'ям.

Рекомендації: На основі профілю користувача надаються рекомендації щодо вакансій.

📦 Сторонні бібліотеки

react-redux — для управління станом

react-router-dom — для маршрутизації

@chakra-ui/react — для UI компонентів

@reduxjs/toolkit — для спрощення роботи з Redux

axios — для HTTP запитів

formik та yup — для роботи з формами та валідації

✅ Стандарти коду

Використання TypeScript для типізації

Чиста та зрозуміла структура компонентів

Використання хуків для управління станом

Використання компонентів Chakra UI для UI
