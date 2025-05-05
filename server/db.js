import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connected to MongoDB Database ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Error ${error}`);
    }
};

export default connectDB;