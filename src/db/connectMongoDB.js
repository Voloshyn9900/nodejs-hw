import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?appName=Cluster-hw`;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error(
      `❌ Error connecting to database`,
      error.message,
    );
  }
};
