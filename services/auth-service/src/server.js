const app = require('./app')
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 4001

const ServerIntializer = async () => {

    await connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Auth service running on port ${PORT}`)
            })
        })
        .catch((err) => {
            console.error('Failed to connect to the database', err);
            process.exit(1);
        });
}

ServerIntializer();
