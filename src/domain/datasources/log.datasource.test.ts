import { LogEntity, LogSeverityLevel } from "../entities/log.entity";
import { LogDataSource } from "./log.datasource";

describe("log.datasource.ts", () => {
  const newLog = new LogEntity({
    level: LogSeverityLevel.low,
    message: "This is a test log",
    origin: "unit-test",
  });

  class MockLogDataSource implements LogDataSource {
    saveLog(log: LogEntity): Promise<void> {
      return Promise.resolve();
    }
    getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return Promise.resolve([newLog]);
    }
  }

  test("should test the abstract class", () => {
    const mockLogDataSource = new MockLogDataSource();
    expect(mockLogDataSource).toBeInstanceOf(MockLogDataSource);
    expect(mockLogDataSource).toHaveProperty("saveLog");
    expect(mockLogDataSource).toHaveProperty("getLogs");
  });
});
