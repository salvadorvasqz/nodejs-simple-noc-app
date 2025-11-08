# Setup & Quick Start

This document expands the quick start steps and provides the recommended order to bring the project up locally.

1. Install dependencies

```powershell
npm install
```

2. Prepare environment variables

Create a `.env` (or `.env.test` for tests) file at the project root. You can use `.env.example` as a starting point. Required variables are listed in `docs/prisma.md` and the README.

3. Start supporting services with Docker

```powershell
docker compose up -d

# Or, for the test environment using the supplied test compose file:
docker compose -f docker-compose.test.yml --env-file .env.test up -d
```

4. Configure Prisma (generate client and apply migrations)

```powershell
npm run prisma:generate
npm run prisma:migrate
# or directly
npx prisma migrate dev --name init
```

5. Start the app in development

```powershell
npm run dev
```

Notes

- If you make changes to `prisma/schema.prisma`, run `npm run prisma:generate` so the generated client is updated.
- For production deployments, use `prisma migrate deploy` and a CI/CD process that manages secrets and migrations.
