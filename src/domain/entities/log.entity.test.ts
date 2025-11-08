import { LogEntity, LogSeverityLevel } from "./log.entity";

describe("LogEntity", () => {
  test("should create a LogEntity instance", () => {
    const logData = {
      message: "testing",
      level: LogSeverityLevel.low,
      origin: "log.entity.test.ts",
    };

    const log = new LogEntity(logData);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(logData.message);
    expect(log.level).toBe(logData.level);
    expect(log.origin).toBe(logData.origin);
  });

  test("should create a LogEntity instance from json", () => {
    const logData = {
      level: "high",
      message: "testing",
      createdAt: "2025-11-07T15:50:55.018Z",
      origin: "log.entity.test.ts",
    };

    const log = LogEntity.FromJson(JSON.stringify(logData));
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(logData.message);
    expect(log.level).toBe(logData.level);
    expect(log.origin).toBe(logData.origin);
  });

  test("should create a LogEntity instance from object", () => {
    const logData = {
      level: "medium",
      message: "testing",
      createdAt: "2025-11-07T15:50:55.018Z",
      origin: "log.entity.test.ts",
    };

    const log = LogEntity.fromObject(logData);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(logData.message);
    expect(log.level).toBe(logData.level);
    expect(log.origin).toBe(logData.origin);
  });
});
