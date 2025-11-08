# NOC

NOC — Network Operations Center (lightweight checks & logging)

This repository contains a small Node.js TypeScript application that performs periodic health checks and records results into multiple storage backends (file system, MongoDB, and PostgreSQL). It can also send email reports with attached logs.

Short guide:

- See `docs/setup.md` for step-by-step setup and start instructions.
- See `docs/prisma.md` for Prisma-specific configuration and commands.
- See `docs/architecture.md` for a short architecture overview.
- See `docs/commands.md` for useful commands (Docker, Prisma, npm).
- Example environment file: `.env.example`

If you need a single-file quick reference, the earlier README contents were removed in favor of the split `docs/` approach — use the docs folder for detailed instructions.
