import type { LogDataSource } from "../../domain/datasources/log.datasource";
import {
  LogEntity,
  type LogSeverityLevel,
} from "../../domain/entities/log.entity";
import { LogModel } from "../../data/mongo/models/log.model";

export class MongoLogDatasource implements LogDataSource {
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await LogModel.create(log);
    await newLog.save();
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await LogModel.find({ level: severityLevel });
    return logs.map(LogEntity.fromObject);
  }
}
