import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  console.log(MONGO_URI);
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env file');
    console.error('Please create a .env file in the backend directory with:');
    console.error('MONGO_URI=mongodb://localhost:27017/crm');
    console.error('Or for MongoDB Atlas: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crm');
    return;
  }
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  }
};

export default connectDB; 