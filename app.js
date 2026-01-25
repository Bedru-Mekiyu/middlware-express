const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const csurf = require('csurf');
const morgan = require('morgan');
const logger = require('./config/logger');


const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const AppError = require('./src/utils/AppError');
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require('cookie-parser');

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use('/api', limiter);

app.use('/api/v1/auth', csrfProtection);

app.get('/api/v1/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

const csrfProtection = csurf({
    cookie: true
});
app.use(csrfProtection);





const limiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP. Please try again later.'
});

const stream = {
    write: (message) => logger.info(message.trim())
};
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream }));
}






// 404 handler
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global error middleware
app.use(errorHandler);

module.exports = app;
