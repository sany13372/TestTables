# TestTables

REST API на Node.js + Express + Sequelize (PostgreSQL).
Frontend React + Zustand
## База данных

Две связанные таблицы (`authors` — `books`, связь по внешнему ключу `books.author_id`).
Каждая таблица содержит поле-ключ и поля типов `NUMERIC`, `VARCHAR`, `DATE`, `INTEGER`.

Запуск через Docker (самый простой):

```bash
docker compose up --build
```

Запуск в ручную:

Создание и заполнение БД (скрипт в корне проекта):

```bash
psql -U postgres -f init-db.sql
```

## Запуск сервера

```bash
cd server
cp .env.example .env
yarn install
yarn dev               
```

Сервер: `http://localhost:3000`.

## Запуск фронтенда

```bash
cd client
cp .env.example .env
yarn install
yarn dev               
```
Фронтенд: `http://localhost:5173`.
