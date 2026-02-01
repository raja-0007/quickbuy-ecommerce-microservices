const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    }catch(error){
        console.error('Database connection error:', error);
    }
}

module.exports = connectDB;