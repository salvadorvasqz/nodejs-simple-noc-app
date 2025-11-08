import { LogEntity } from "../../entities/log.entity";
import { CheckService } from "./check-service";

describe("check-service.ts", () => {
  const logRepositoryMock = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const successCallback = jest.fn();
  const errorCallback = jest.fn();

  const checkService = new CheckService(
    logRepositoryMock,
    successCallback,
    errorCallback
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call success callback when check is successful", async () => {
    const result = await checkService.execute(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    expect(result).toBeTruthy();
    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(logRepositoryMock.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
  });

  test("should call error callback when check fails", async () => {
    const result = await checkService.execute(
      "https://wwww.invalid-url-to-fail-test.com"
    );

    expect(result).toBeFalsy();
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
    expect(logRepositoryMock.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
  });
});
