# 🛍️ tkeep — Автоматизированный Каталог Объявлений (SPA)

Одностраничное веб-приложение (SPA) — каталог товаров и услуг **«tkeep»** с поддержкой автоматического импорта с [Kufar.by](https://www.kufar.by/), тёмным дизайном в стиле Glassmorphism, скрытой админ-панелью, доступной по прямому URL, фильтрацией по категориям и интерактивной связью через Telegram.

---

## 🛠️ Технический Стек

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Vanilla CSS Glassmorphism
- **Backend / База данных**: Firebase Firestore (NoSQL), Firebase Authentication (Email/Password)
- **Импорт Kufar**: Автоматический парсинг метаданных объявления (Title, Description, Price, Images с CDN Куфара, Location) с предпросмотром и поддержкой CORS-прокси и Firebase Cloud Functions
- **Хостинг**: GitHub Pages (статическая сборка в папку `/dist`)
- **Маршрутизация**: Hash Routing (`/#/`, `/#/item/:id`, `/#/admin`) для прямых ссылок на товары и скрытого входа в админку

---

## 🔐 Вход в Админ-Панель (По адресному URL)

Вход в панель управления **скрыт** от обычных посетителей сайта (кнопки входа в меню и футере отсутствуют).

Для перехода в админ-панель откройте адрес в строке браузера:
👉 **`/#/admin`** (или **`/#/login`**)

- **Логин**: `d2c`
- **Пароль**: `717887`

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

## 🔥 Настройка Firebase (Firestore + Auth)

### 1. Создание проекта Firebase
1. Перейдите в [Firebase Console](https://console.firebase.google.com/) и нажмите **«Добавить проект»** (например, `tkeep-catalog`).
2. Зарегистрируйте **Web App** (`</>`) и скопируйте объект `firebaseConfig`.

### 2. Настройка Firestore Database
1. В левом меню откройте **Firestore Database** -> **Создать базу данных**.
2. Скопируйте правила из файла [`firestore.rules`](./firestore.rules):
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
1. Включите провайдер **«Email / Пароль»**.
2. Создайте пользователя для администратора:
   - **Email**: `d2c@tkeep.by`
   - **Password**: `787352`

---

## 📦 Деплой на GitHub Pages

Проект настроен для статической публикации на **GitHub Pages** с помощью библиотеки `gh-pages`.

### Шаг 1: Подготовка репозитория
```bash
git add .
git commit -m "Update admin access to direct URL bar"
git push origin main
```

### Шаг 2: Публикация
```bash
npm run deploy
```

---

## 📱 Контакты

В футере и модальных окнах товара размещена прямая ссылка на Telegram:
👉 **[t.me/tkeepk](https://t.me/tkeepk)**
