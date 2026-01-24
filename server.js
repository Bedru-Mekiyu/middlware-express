const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/db');
connectDB();


process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION');
    console.error(err);
    process.exit(1);
});

const app = require('./app');

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server running...');
});

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION');
    console.error(err);
    server.close(() => {
        process.exit(1);
    });
});
