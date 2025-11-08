import type { LogDataSource } from "@domain/datasources/log.datasource.js";
import type {
  LogEntity,
  LogSeverityLevel,
} from "@domain/entities/log.entity.ts";
import type { LogRepository } from "@domain/repository/log.repository.ts";

export class LogRepositoryImplementation implements LogRepository {
  constructor(private readonly dataSource: LogDataSource) {}
  
  async saveLog(log: LogEntity): Promise<void> {
    await this.dataSource.saveLog(log);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.dataSource.getLogs(severityLevel);
  }
}
