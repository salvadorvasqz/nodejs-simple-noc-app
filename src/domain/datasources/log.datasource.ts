import type { LogEntity, LogSeverityLevel } from "@domain/entities/log.entity.ts";

export abstract class LogDataSource {
  abstract saveLog(log: LogEntity): Promise<void>;
  abstract getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]>;
}
