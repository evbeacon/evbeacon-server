import mongoose from "mongoose";

const isTesting = process.env.NODE_ENV === "test";

export default async (): Promise<void> => {
  if (mongoose.connections[0].readyState) return;

  await mongoose
    .connect(
      (isTesting ? process.env.MONGO_URL : process.env.DATABASE_URL) as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    )
    .catch((e: Error) => {
      console.error("Error connecting to database.");

      throw e;
    });
};
