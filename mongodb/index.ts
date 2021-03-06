import mongoose from "mongoose";
import dayjs from "dayjs";
import utcTime from "dayjs/plugin/utc";

dayjs.extend(utcTime);

const isTesting = process.env.NODE_ENV === "test";

export default async (): Promise<void> => {
  if (!isTesting && mongoose.connections[0].readyState) return;

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
