import mongoose from "mongoose";

import { envs } from "../../config/plugins/envs.plugins";
import { MongoLogDatasource } from "./mongo-log.datasource";
import { MongoDatabase } from "../../data/mongo/init";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogModel } from "../../data/mongo/models/log.model";

describe("mongo-log.datasource.test.ts", () => {
  const logEntry = new LogEntity({
    message: "Test log entry",
    level: LogSeverityLevel.medium,
    origin: "mongo-log.datasource.test.ts",
  });

  beforeEach(async () => {
    await MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    });
  });

  afterEach(async () => {
    await LogModel.deleteMany();
    mongoose.connection.close();
  });

  test("should create a log entry", async () => {
    const logSpy = jest.spyOn(MongoLogDatasource.prototype, "saveLog");
    const logDataSource = new MongoLogDatasource();
    await logDataSource.saveLog(logEntry);
    expect(logSpy).toHaveBeenCalledWith(logEntry);
  });

  test("should get logs", async () => {
    const logDataSource = new MongoLogDatasource();
    await logDataSource.saveLog(logEntry);
    const logs = await logDataSource.getLogs(LogSeverityLevel.medium);
    expect(logs.length).toBe(1);
  });
});
