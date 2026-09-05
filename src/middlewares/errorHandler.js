const AppError = require('../utils/AppError');
const logger = require('../config/logger');

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired. Please log in again.', 401);

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode || 500).json({
            status: err.status || 'error',
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // Operational error
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }

    console.error('UNEXPECTED ERROR:', err);

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong.'
    });
};

module.exports = errorHandler;
