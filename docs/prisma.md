# Prisma

Prisma is used to persist logs into PostgreSQL. The Prisma schema is defined in `prisma/schema.prisma`. The generator in the schema outputs the client to `src/generated/prisma`.

Common tasks

- Generate client (after schema changes or on first checkout):

```powershell
npm run prisma:generate
```

- Run development migrations and apply to local DB:

```powershell
npm run prisma:migrate
# or
npx prisma migrate dev --name init
```

- Open Prisma Studio to view/edit data:

```powershell
npx prisma studio
```

- Reset development DB (destructive):

```powershell
npx prisma migrate reset --force
```

Notes & tips

- The Prisma client import path used by the codebase is `src/generated/prisma/client.js`. If you change the generator `output` path in `prisma/schema.prisma`, update imports accordingly.
- `prisma migrate dev` is intended for development. For production migrations, prefer `prisma migrate deploy` executed by your CI/CD pipeline.
