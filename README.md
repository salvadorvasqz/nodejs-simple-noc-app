# NOC

NOC — Network Operations Center (lightweight checks & logging)

NOC is a small Node.js TypeScript project that performs periodic health checks against services and records results into multiple storage backends (file system, MongoDB and PostgreSQL). It can also send email reports containing collected logs.

The project demonstrates a clean separation between domain, infrastructure and presentation layers, and uses Prisma for PostgreSQL models and Mongoose for MongoDB models.

## Contents

- `src/` — application source code (domain, infrastructure, presentation)
- `prisma/schema.prisma` — Prisma schema for PostgreSQL

# NOC

NOC — Network Operations Center (lightweight checks & logging)

NOC is a small Node.js TypeScript project that performs periodic health checks against services and records results into multiple storage backends (file system, MongoDB and PostgreSQL). It can also send email reports containing collected logs.

The project demonstrates a clean separation between domain, infrastructure and presentation layers, and uses Prisma for PostgreSQL models and Mongoose for MongoDB models.

## Contents

- `src/` — application source code (domain, infrastructure, presentation)
- `prisma/schema.prisma` — Prisma schema for PostgreSQL
- `docker-compose.yml` and `docker-compose.test.yml` — Docker Compose setups (databases for dev/test)
- `logs/` — runtime log files (created by the file system datasource)

## Features

- Periodic checks via `CronService`.
- Multi-backend logging: file system, MongoDB, and PostgreSQL.
- Email reports with attached log files using `nodemailer`.
- TypeScript, Jest tests, and Prisma client generation.

## Quick start (recommended order)

Follow this order to get the project running in a safe and reproducible way:

1. Install dependencies

```powershell
npm install
```

2. Prepare environment variables file

Before starting Docker or Prisma, create a `.env` file (or `.env.test` for tests) with the variables listed in the "Environment variables" section. You can copy and adapt the example provided below.

3. Start supporting services with Docker (databases)

```powershell
# Start services defined in docker-compose.yml (or use docker-compose.test.yml for the test environment)
docker compose up -d

# If using the test compose file with .env.test:
docker compose -f docker-compose.test.yml --env-file .env.test up -d
```

4. Configure Prisma (generate client and apply migrations)

Generate the Prisma client and create/apply migrations. Run these commands from the project root:

```powershell
# Generate the client (required after schema changes or on first checkout)
npm run prisma:generate

# Create and apply development migrations (choose a name, e.g. "init")
npm run prisma:migrate
# or directly
npx prisma migrate dev --name init
```

5. Run in development mode

```powershell
npm run dev
```

The server will start and `Server.start()` will create the cron job that runs the checks and persists logs to the configured backends.

This project uses `env-var` and requires the following environment variables. Example values are taken from the test plugin and may be used in `.env` or `.env.test` files.

- `PORT` — application port (number). Example: `3000`
- `MAILER_SERVICE` — nodemailer service name. Example: `gmail`
- `MAILER_EMAIL` — sender email address. Example: `email@gmail.com`
- `MAILER_SECRET_KEY` — sender account secret / app password. Example: `123456789`

MongoDB configuration:

- `MONGO_URL` — MongoDB connection string. Example: `mongodb://test-noc:123456@localhost:27017`
- `MONGO_DB_NAME` — database name. Example: `NOC-TEST`
- `MONGO_USER`, `MONGO_PASS` — credentials for MongoDB (if needed).

PostgreSQL / Prisma configuration:

- `POSTGRES_URL` — full connection string. Example: `postgresql://postgres:123456@localhost:5432/NOC-TEST`
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — individual postgres params.

Create a `.env` file with the required values for development and a `.env.test` for tests if you use the provided compose file. Example `.env.test` (based on test values):

```text
PORT=3000
MAILER_SERVICE=gmail
MAILER_EMAIL=email@gmail.com
MAILER_SECRET_KEY=123456789
MONGO_URL=mongodb://test-noc:123456@localhost:27017
MONGO_DB_NAME=NOC-TEST
MONGO_USER=test-noc
MONGO_PASS=123456
POSTGRES_URL=postgresql://postgres:123456@localhost:5432/NOC-TEST
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=NOC-TEST
```

## Databases

- PostgreSQL: Prisma schema is in `prisma/schema.prisma`. Run `npm run prisma:generate` after changing the schema. Use `npm run prisma:migrate` to apply migrations in development.
- MongoDB: Mongoose models are used for storing logs in MongoDB (look under `src/data/mongo` if present).

The Prisma model used is `LogModel` with fields `id`, `message`, `origin`, `level` (enum `SeverityLevel`), and `createdAt`.

## Prisma configuration

Follow these steps to configure and use Prisma with the project's PostgreSQL datasource.

1. Ensure the PostgreSQL connection is available and configured in your environment. The project reads the connection from `POSTGRES_URL` (see "Environment variables" above). Example:

```text
POSTGRES_URL=postgresql://postgres:123456@localhost:5432/NOC-DEV
```

2. Start PostgreSQL. If you use Docker Compose you can start the provided compose (or the test compose) first. Example (uses the test compose file):

```powershell
docker compose -f docker-compose.test.yml --env-file .env.test up -d
```

3. Generate the Prisma client (run after changing the schema or on first checkout):

```powershell
npm run prisma:generate
# or directly
npx prisma generate
```

4. Create and apply migrations during development:

```powershell
npm run prisma:migrate
# or directly
npx prisma migrate dev --name init
```

This will create SQL migration files in the `prisma/migrations/` folder and apply them to the database referenced by `POSTGRES_URL`.

5. (Optional) Open Prisma Studio to inspect your database visually:

```powershell
npx prisma studio
```

6. If you need to reset the development database (WARNING: destructive), use:

```powershell
npx prisma migrate reset --force
```

Notes:

- The Prisma client generator in `prisma/schema.prisma` is configured to output to `src/generated/prisma`. The code imports the generated client from `src/generated/prisma/client.js`. If you change the generator output path, update imports accordingly.
- Use `npm run prisma:generate` after any schema changes so the TypeScript/JS client stays in sync.
- `prisma migrate dev` should only be run against development databases. For production, prefer `prisma migrate deploy` with a CI/CD workflow.

## How it works (high level)

- `src/app.ts` connects to MongoDB and starts the `Server`.
- `Server.start()` (in `src/presentation/server.ts`) instantiates three repositories backed by:
  - `FileSystemDataSource` — writes to files in `logs/`
  - `MongoLogDatasource` — stores logs in MongoDB
  - `PostgresLogDatasource` — stores logs in PostgreSQL via Prisma
- A cron job is created using `CronService.createJob`, which runs the `CheckServiceMultiple` use-case on a schedule (configured in code; by default the example uses `*/5 * * * * *` i.e. every 5 seconds). The check calls the supplied URL and logs success or failure across all configured repositories.
- `EmailService` (in `src/presentation/email/email-service.ts`) can send an email with attached log files from `logs/`.

## Logs

At runtime, the `FileSystemDataSource` ensures `logs/` exists and creates three files:

- `logs-all.log` — every log
- `logs-medium.log` — level `medium`
- `logs-high.log` — level `high`

These files are used by the email report feature.

## Testing

Tests use Jest. The `test` script starts test containers using `docker-compose.test.yml` and then runs `jest`.

# NOC

NOC — Network Operations Center (lightweight checks & logging)

NOC is a small Node.js TypeScript project that performs periodic health checks against services and records results into multiple storage backends (file system, MongoDB and PostgreSQL). It can also send email reports containing collected logs.

The project demonstrates a clean separation between domain, infrastructure and presentation layers, and uses Prisma for PostgreSQL models and Mongoose for MongoDB models.

## Contents

- `src/` — application source code (domain, infrastructure, presentation)
- `prisma/schema.prisma` — Prisma schema for PostgreSQL
- `docker-compose.yml` and `docker-compose.test.yml` — Docker Compose setups (databases for dev/test)
- `logs/` — runtime log files (created by the file system datasource)

## Features

- Periodic checks via `CronService`.
- Multi-backend logging: file system, MongoDB, and PostgreSQL.
- Email reports with attached log files using `nodemailer`.
- TypeScript, Jest tests, and Prisma client generation.

## Quick start (recommended order)

Follow this order to get the project running in a safe and reproducible way:

1. Install dependencies

```powershell
npm install
```

2. Prepare environment variables file

Before starting Docker or Prisma, create a `.env` file (or `.env.test` for tests) with the variables listed in the "Environment variables" section. You can copy and adapt the example provided elsewhere in this README.

3. Start supporting services with Docker (databases)

```powershell
# Start services defined in docker-compose.yml (or use docker-compose.test.yml for the test environment)
docker compose up -d

# If using the test compose file with .env.test:
docker compose -f docker-compose.test.yml --env-file .env.test up -d
```

4. Configure Prisma (generate client and apply migrations)

Generate the Prisma client and create/apply migrations. Run these commands from the project root:

```powershell
# Generate the client (required after schema changes or on first checkout)
npm run prisma:generate

# Create and apply development migrations (choose a name, e.g. "init")
npm run prisma:migrate
# or directly
npx prisma migrate dev --name init
```

5. Run in development mode

```powershell
npm run dev
```

The server will start and `Server.start()` will create the cron job that runs the checks and persists logs to the configured backends.
