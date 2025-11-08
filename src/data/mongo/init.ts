import mongoose from "mongoose";

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect({
    mongoUrl,
    dbName,
  }: ConnectionOptions): Promise<boolean> {
    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
