


import mongoose from "mongoose";

export const connectMongoDb = async () => {
    console.log(process.env.DB_URI);
  try {
    const data = await mongoose.connect(process.env.DB_URI);

    console.log(`MongoDB Connected: ${data.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
};