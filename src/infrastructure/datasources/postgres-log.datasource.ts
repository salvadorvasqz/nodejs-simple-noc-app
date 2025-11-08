import type { LogDataSource } from "@domain/datasources/log.datasource.js";
import {
  LogEntity,
  type LogSeverityLevel,
} from "@domain/entities/log.entity.js";
import { PrismaClient, SeverityLevel } from "src/generated/prisma/client.js";

const prisma = new PrismaClient();

const severityEnum = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH,
};

export class PostgresLogDatasource implements LogDataSource {
  async saveLog(log: LogEntity): Promise<void> {
    try {
      const level = severityEnum[log.level];
      await prisma.logModel.create({
        data: {
          ...log,
          level,
        },
      });
    } catch (error) {
      console.error("Error saving log to PostgreSQL:", error);
    }
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = severityEnum[severityLevel];
    const logs = await prisma.logModel.findMany({
      where: { level },
    });
    return logs.map(LogEntity.fromObject);
  }
}
