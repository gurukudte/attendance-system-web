import mongoose from "mongoose";
const connectToMongoDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export default connectToMongoDB;
