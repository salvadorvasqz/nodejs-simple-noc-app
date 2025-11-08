import nodemailer from "nodemailer";

import { envs } from "src/config/plugins/envs.plugins.js";

interface SendMailOptions {
  to: string[] | string;
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendMail({
    to,
    subject,
    htmlBody,
    attachments = [],
  }: SendMailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);

      return false;
    }
  }

  sendEmailWithFileSystemLogs(to: string | string[]): Promise<boolean> {
    const subject = "Logs Report";
    const htmlBody = "<h1>Attached are the logs reports.</h1>";
    const attachments: Attachment[] = [
      {
        filename: "logs-all.log",
        path: "./logs/logs-all.log",
      },
      {
        filename: "logs-medium.log",
        path: "./logs/logs-medium.log",
      },
      {
        filename: "logs-high.log",
        path: "./logs/logs-high.log",
      },
    ];
    return this.sendMail({ to, subject, htmlBody, attachments });
  }
}
