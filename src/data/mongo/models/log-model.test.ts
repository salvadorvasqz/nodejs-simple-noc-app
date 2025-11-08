import mongoose from "mongoose";
import { MongoDatabase } from "../init";
import { LogModel } from "./log.model";

describe("LogModel mongo", () => {
  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoUrl: process.env.MONGO_URL as string,
      dbName: process.env.MONGO_DB_NAME as string,
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  test("should create a log", async () => {
    const logData = {
      level: "low",
      message: "Test log",
      origin: "unit-test",
    };
    const log = await LogModel.create(logData);
    expect(log).toEqual(
      expect.objectContaining({
        ...logData,
        id: expect.any(String),
        createdAt: expect.any(Date),
      })
    );
    await LogModel.findByIdAndDelete(log._id);
  });

  test("should return the schema object", () => {
    const schema = LogModel.schema.obj;

    expect(schema).toEqual(
      expect.objectContaining({
        level: {
          type: expect.any(Function),
          required: true,
          enum: ["low", "medium", "high"],
          default: "low",
        },
        message: { type: expect.any(Function), required: true },
        origin: { type: expect.any(Function), required: true },
        createdAt: expect.any(Object),
      })
    );
  });
});
