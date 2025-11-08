import { LogRepositoryImplementation } from "@infrastructure/repositories/log.repository.implementation.js";
import { PostgresLogDatasource } from "@infrastructure/datasources/postgres-log.datasource.js";
import { CronService } from "./cron/cron-service.js";
import { CheckServiceMultiple } from "@domain/use-cases/checks/check-service-multiple.js";
import { MongoLogDatasource } from "@infrastructure/datasources/mongo-log.datasource.js";
import { FileSystemDataSource } from "@infrastructure/datasources/file-system.datasource.js";

const fsLogRepository = new LogRepositoryImplementation(
  new FileSystemDataSource()
);

const mongoLogRepository = new LogRepositoryImplementation(
  new MongoLogDatasource()
);
const postgresLogRepository = new LogRepositoryImplementation(
  new PostgresLogDatasource()
);

export class Server {
  public static start() {
    console.log("Server started");

    CronService.createJob("*/5 * * * * *", () => {
      new CheckServiceMultiple(
        [fsLogRepository, mongoLogRepository, postgresLogRepository],
        () => {
          console.log("Check service succeeded");
        },
        (error) => {
          console.error(`Check service failed: ${error}`);
        }
      ).execute("https://localhost:3001/health");
    });
  }
}
