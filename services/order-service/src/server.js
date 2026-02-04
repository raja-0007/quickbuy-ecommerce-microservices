import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
dotenv.config();

const PORT = process.env.PORT || 4002


const Initializer = async () => {
  try{
    await connectDB()
    .then(()=>{
      app.listen(PORT, () => {
        console.log(`Order service running on port ${PORT}`)
      })
    })
  }catch(err){
    console.error('Failed to connect to the database', err);
    process.exit(1);
  }
}

Initializer();