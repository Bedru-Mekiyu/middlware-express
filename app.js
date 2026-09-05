const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const csurf = require('csurf');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const logger = require('./src/config/logger');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const AppError = require('./src/utils/AppError');

const app = express();

const limiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP. Please try again later.'
});

const csrfProtection = csurf({
    cookie: true
});

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use('/api', limiter);

const stream = {
    write: (message) => logger.info(message.trim())
};
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream }));
}

app.get('/api/v1/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/v1/auth', csrfProtection, authRoutes);
app.use('/api/v1/users', userRoutes);

// 404 handler
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global error middleware
app.use(errorHandler);

module.exports = app;
