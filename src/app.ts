import "dotenv/config";

import { Server } from "@presentation/server.js";
import { MongoDatabase } from "./data/mongo/init.js";
import { envs } from "./config/plugins/envs.plugins.js";

(async () => {
  await main();
})();

async function main() {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });
  Server.start();
}
