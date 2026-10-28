import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecom';
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
    }
};

export default connectDB;