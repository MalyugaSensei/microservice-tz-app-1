# microservice-tz-app-1
## Run tasks
`docker compose up -d --build`
## Task №1
Stack:
* Express.js as REST API framework
* PostgreSQL + Sequelize ORM
* RabbitMQ as a message broker between services

### User service use 3000 port. Endpoints:
* `GET /users?page=<number>&limit=<number>` - Получить всех пользователь. Дополнительно можно использовать пагинацию

* `POST /users` - Создать пользователя

* `PUT /users/:id` - Обновить данные пользователя. Необходимо отправлять все поля

* `PATCH /users/:id` - Обновить данные пользователя. Передаваемые поля не обязательны

Схема базы данных для таблицы Users выполняет миграцию автоматически при запуске сервера, так же таблица набивается пользователями (1200000 всего записей).
Чтобы очистить таблицу от пользователей необходимо из под контейнера `postgres-users` выполнить команду `npx sequelize db:seed:undo:all`, а для повторной набивки таблицы `npx sequelize db:seed:all`

### User action service use 3001 port. Endpoints:
* `GET /user-actions/:user_id?page=<number>&limit=<number>` - Получает все действия пользователя с указанным ID. Дополнительно можно использовать пагинацию

## Task №2
### User action service use 3002 port. Endpoints:
* `PATCH /users/no-problem` - Обновляет всем пользователям столбец problems на true и возвращает количество измененных строк