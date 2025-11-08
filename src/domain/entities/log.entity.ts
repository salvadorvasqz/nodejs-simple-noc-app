export enum LogSeverityLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface LogEntityOptions {
  level: LogSeverityLevel;
  message: string;
  origin: string;
  createdAt?: Date;
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public createdAt: Date;
  public origin: string;

  constructor({
    level,
    message,
    origin,
    createdAt = new Date(),
  }: LogEntityOptions) {
    this.level = level;
    this.message = message;
    this.createdAt = createdAt;
    this.origin = origin;
  }

  public static readonly FromJson = (json: string): LogEntity => {
    json = json === "" ? "{}" : json;
    const { level, message, createdAt, origin } = JSON.parse(json);
    const log = new LogEntity({
      level,
      message,
      createdAt: new Date(createdAt),
      origin,
    });
    log.createdAt = new Date(createdAt);
    return log;
  };

  public static readonly fromObject = (object: {
    [key: string]: any;
  }): LogEntity => {
    return new LogEntity({
      level: object.level as LogSeverityLevel,
      message: object.message,
      createdAt: new Date(object.createdAt),
      origin: object.origin,
    });
  };
}
