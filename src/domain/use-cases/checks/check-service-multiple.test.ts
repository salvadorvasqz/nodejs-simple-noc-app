import { LogEntity } from "../../entities/log.entity";
import { CheckServiceMultiple } from "./check-service-multiple";

describe("check-service-multiple.ts", () => {
  const logRepositoryMock1 = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const logRepositoryMock2 = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const successCallback = jest.fn();
  const errorCallback = jest.fn();

  const checkServiceMultiple = new CheckServiceMultiple(
    [logRepositoryMock1, logRepositoryMock2],
    successCallback,
    errorCallback
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call success callback when check is successful", async () => {
    const result = await checkServiceMultiple.execute(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    expect(result).toBeTruthy();
    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(logRepositoryMock1.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(logRepositoryMock2.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
  });

  test("should call error callback when check fails", async () => {
    const result = await checkServiceMultiple.execute(
      "https://wwww.invalid-url-to-fail-test.com"
    );

    expect(result).toBeFalsy();
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
    expect(logRepositoryMock1.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
  });
});
