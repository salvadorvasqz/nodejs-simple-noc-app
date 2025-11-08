import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import type { LogRepository } from "../../repository/log.repository";
import type { EmailService } from "@presentation/email/email-service";

interface SendEmailLogsUseCase {
  execute(to: string | string[]): Promise<boolean>;
}

export class SendEmailLogs implements SendEmailLogsUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  async execute(to: string | string[]): Promise<boolean> {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
      if (!sent) {
        throw new Error("Failed to send email with logs");
      }
      this.logRepository.saveLog(
        new LogEntity({
          level: LogSeverityLevel.low,
          message: `Email sent to ${to} with subject: Logs Report`,
          origin: "send-email-logs.ts",
        })
      );
      return true;
    } catch (error) {
      console.log(error);
      this.logRepository.saveLog(
        new LogEntity({
          level: LogSeverityLevel.high,
          message: `Error sending email to ${to} with subject: Logs Report`,
          origin: "send-email-logs.ts",
        })
      );
      return false;
    }
  }
}
