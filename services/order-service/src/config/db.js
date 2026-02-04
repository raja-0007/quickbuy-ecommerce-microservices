
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');

    }catch(err){
        console.error('Database connection error:', err);
    }
}

export default connectDB;