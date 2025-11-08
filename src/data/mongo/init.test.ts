import mongoose from "mongoose";
import { MongoDatabase } from "./init";

describe("init mongoDB", () => {
  afterAll(() => {
    mongoose.connection.close();
  });

  test("should connect mongoDB", async () => {
    const result = await MongoDatabase.connect({
      mongoUrl: process.env.MONGO_URL as string,
      dbName: process.env.MONGO_DB_NAME as string,
    });
    expect(result).toBe(true);
  });
});
