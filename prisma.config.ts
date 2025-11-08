import "dotenv/config";
import env from "env-var";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env.get("POSTGRES_URL").required().asString(),
  },
});
