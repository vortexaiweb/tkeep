# 🛍️ tkeep — Автоматизированный Каталог Объявлений (SPA)

Одностраничное веб-приложение (SPA) — каталог товаров и услуг **«tkeep»** с поддержкой автоматического импорта с [Kufar.by](https://www.kufar.by/), тёмным дизайном в стиле Glassmorphism, защищённой админ-панелью, фильтрацией по категориям и интерактивной связью через Telegram.

---

## 🛠️ Технический Стек

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Vanilla CSS Glassmorphism
- **Backend / База данных**: Firebase Firestore (NoSQL), Firebase Authentication (Email/Password)
- **Импорт Kufar**: Автоматический парсинг метаданных объявления (Title, Description, Price, Images с CDN Куфара, Location) с предпросмотром и поддержкой CORS-прокси и Firebase Cloud Functions
- **Хостинг**: GitHub Pages (статическая сборка в папку `/dist`)
- **Маршрутизация**: Hash Routing (`/#/`, `/#/item/:id`, `/#/admin`) для прямых ссылок на товары

---

## 🚀 Быстрый старт (Локальный запуск)

1. Клонируйте репозиторий или перейдите в папку проекта:
   ```bash
   cd tkeep
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Запустите сервер разработки:
   ```bash
   npm run dev
   ```
   Приложение будет доступно по адресу: `http://localhost:5173/`

---

## 🔒 Данные для входа в Админ-Панель

- **Логин**: `d2c`
- **Пароль**: `787352`

*(Авторизация происходит через Firebase Auth с автоматической трансляцией в `d2c@tkeep.by` и локальной защитой сессии)*

---

## 🔥 Настройка Firebase (Firestore + Auth)

### 1. Создание проекта Firebase
1. Перейдите в [Firebase Console](https://console.firebase.google.com/) и нажмите **«Добавить проект»** (например, `tkeep-catalog`).
2. Зарегистрируйте **Web App** (`</>`) и скопируйте объект `firebaseConfig`.

### 2. Настройка Firestore Database
1. В левом меню откройте **Firestore Database** -> **Создать базу данных**.
2. Выберите регион (например, `europe-west3` / `europe-west1`) и запустите в тестовом режиме.
3. Вкладка **Правила (Rules)** — скопируйте содержимое из файла [`firestore.rules`](./firestore.rules):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       function isAdmin() {
         return request.auth != null;
       }
       match /categories/{categoryId} {
         allow read: if true;
         allow write: if isAdmin();
       }
       match /items/{itemId} {
         allow read: if resource.data.status == 'active' || isAdmin();
         allow write: if isAdmin();
       }
     }
   }
   ```

### 3. Настройка Firebase Auth
1. Откройте **Authentication** -> **Get Started**.
2. Включите провайдер **«Email / Пароль»**.
3. Создайте пользователя для администратора:
   - **Email**: `d2c@tkeep.by`
   - **Password**: `787352`

### 4. Подключение ключей в проект
Вставьте ваши ключи Firebase в файл `src/services/firebase.js` или создайте `.env` файл в корне:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tkeep-catalog.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tkeep-catalog
VITE_FIREBASE_STORAGE_BUCKET=tkeep-catalog.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:...
```

---

## 📦 Деплой на GitHub Pages

Проект настроен для статической публикации на **GitHub Pages** с помощью библиотеки `gh-pages`.

### Шаг 1: Подготовка репозитория
1. Загрузите код в ваш GitHub репозиторий:
   ```bash
   git init
   git add .
   git commit -m "Initial commit tkeep catalog"
   git branch -M main
   git remote add origin https://github.com/ВАШ_USERNAME/tkeep.git
   git push -u origin main
   ```

### Шаг 2: Публикация
Выполните одну команду в терминале:
```bash
npm run deploy
```
*Эта команда автоматически соберёт оптимизированный бандл (`npm run build`) в папку `dist` и задеплоит его в ветку `gh-pages`.*

### Шаг 3: Включение в GitHub Settings
1. Зайдите в ваш репозиторий на GitHub -> **Settings** -> **Pages**.
2. В поле **Source** выберите ветку `gh-pages` / `/ (root)`.
3. Сохраните. Ваше веб-приложение станет доступно по адресу:
   `https://ВАШ_USERNAME.github.io/tkeep/`

---

## ⚡ Интеграция и парсинг объявления с Kufar.by

1. Зайдите в админ-панель (**Логин**: `d2c` / **Пароль**: `787352`).
2. Откройте вкладку **«Импорт с Куфара»**.
3. Вставьте ссылку на объявление (например: `https://www.kufar.by/item/214983214`).
4. Нажмите **«Загрузить данные»**.
5. Система извлечёт название, описание, цену, категорию и ссылки на фото напрямую с CDN Куфара (`https://img.kufar.by/...`).
6. Проверьте предпросмотр и нажмите **«Сохранить в Firestore»**.

---

## 📱 Контакты

В футере и модальных окнах товара размещена прямая ссылка на Telegram:
👉 **[t.me/tkeepk](https://t.me/tkeepk)**
