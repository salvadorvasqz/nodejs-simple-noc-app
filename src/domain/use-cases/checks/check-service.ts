import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
  private readonly logRepository: LogRepository;
  private readonly onSuccess: SuccessCallback;
  private readonly onFailure: ErrorCallback;

  constructor(
    logRepository: LogRepository,
    onSuccess: SuccessCallback,
    onFailure: ErrorCallback
  ) {
    this.logRepository = logRepository;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
  }

  async execute(url: string): Promise<boolean> {
    try {
      const request = await fetch(url);
      if (!request.ok) throw new Error(`Error on check service: ${url}`);

      this.logRepository.saveLog(
        new LogEntity({
          level: LogSeverityLevel.low,
          message: `Service check successful for URL: ${url}`,
          origin: "check-service.ts",
        })
      );
      this.onSuccess();

      return true;
    } catch (error) {
      const errorMessage = `${error}`;
      this.logRepository.saveLog(
        new LogEntity({
          level: LogSeverityLevel.high,
          message: errorMessage,
          origin: "check-service.ts",
        })
      );
      this.onFailure(errorMessage);
      return false;
    }
  }
}
