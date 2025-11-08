# Useful commands

Docker

```powershell
# Start services in background
docker compose up -d

# Stop and remove containers
docker compose down

# For test compose file with environment file
docker compose -f docker-compose.test.yml --env-file .env.test up -d
```

Prisma

```powershell
# Generate client
npm run prisma:generate

# Create and apply dev migrations
npx prisma migrate dev --name init

# Open Prisma Studio
npx prisma studio

# Reset DB (destructive)
npx prisma migrate reset --force
```

NPM

```powershell
npm install
npm run dev
npm run build
npm start
npm run test
```

Checking logs

```powershell
# Tail application logs written to logs/logs-all.log
Get-Content -Path logs\logs-all.log -Wait
```
