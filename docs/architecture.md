# Architecture

This project follows a simple layered/ports-and-adapters architecture. The main layers are:

- Presentation: `src/presentation` — orchestrates high-level features (cron jobs, email service, server start)
- Domain: `src/domain` — core entities, use-cases and interfaces (e.g., `LogEntity`, `LogRepository`, `CheckServiceMultiple`)
- Infrastructure: `src/infrastructure` — concrete implementations of data sources and repositories (File system, MongoDB, PostgreSQL via Prisma)
- Data: `src/data` — DB initialization and models (Mongoose models, Prisma generated client)

Data flow (example: health check run)

1. `CronService` invokes `CheckServiceMultiple` on a schedule.
2. `CheckServiceMultiple` performs the HTTP call to the configured service.
3. On success or failure it creates a `LogEntity` and calls `saveLog` on each configured `LogRepository`.
4. `LogRepositoryImplementation` delegates to the configured `LogDataSource` (FileSystemDataSource, MongoLogDatasource, PostgresLogDatasource).
5. Each datasource persists the log in its own backend (append file line, insert Mongo document, create Prisma record).

Why this structure

- Clear separation makes it easy to add/remove backends.
- Use-cases remain testable and independent from persistence details.
