const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/db');
const logger = require('./config/logger');

connectDB();

process.on('uncaughtException', err => {
    logger.error({
        event: 'Uncaught Exception',
        message: err.message,
        stack: err.stack
    });
    process.exit(1);
});


const app = require('./app');

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server running...');
});

process.on('unhandledRejection', err => {
    logger.error({
        event: 'Unhandled Rejection',
        message: err.message,
        stack: err.stack
    });
    server.close(() => {
        process.exit(1);
    });
});
