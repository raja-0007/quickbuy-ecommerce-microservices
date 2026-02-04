const app = require('./app')
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4003


const Initializer = async () => {
  try{
    await connectDB()
    .then(()=>{
      app.listen(PORT, () => {
        console.log(`Product service running on port ${PORT}`)
      })
    })
  }catch(err){
    console.error('Failed to connect to the database', err);
    process.exit(1);
  }
}

Initializer();