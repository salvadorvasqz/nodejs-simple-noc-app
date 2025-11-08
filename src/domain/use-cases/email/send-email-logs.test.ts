import { SendEmailLogs } from "./send-email-logs";

describe("send-email-logs.ts", () => {
  const sendEmailMock = (to: string | string[]) =>
    typeof to === "string"
      ? to === "test@example.com"
      : to.includes("test@example.com");
  const emailService = {
    sendEmail: jest.fn(sendEmailMock),
    sendEmailWithFileSystemLogs: jest.fn(sendEmailMock),
  } as any;

  const logRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const sendEmailLogs = new SendEmailLogs(emailService, logRepository);
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should send an email", async () => {
    const result = await sendEmailLogs.execute(["test@example.com"]);

    expect(result).toBe(true);
    expect(emailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith([
      "test@example.com",
    ]);
    expect(logRepository.saveLog).toHaveBeenCalled();
  });

  test("should return error on sending an email", async () => {
    const result = await sendEmailLogs.execute(["test-example.com"]);

    expect(result).toBe(false);
    expect(emailService.sendEmailWithFileSystemLogs).toHaveBeenCalledWith([
      "test-example.com",
    ]);
    expect(logRepository.saveLog).toHaveBeenCalled();
  });
});
