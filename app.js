const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const AppError = require('./src/utils/AppError');
const authRoutes = require('./src/routes/authRoutes');




const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// 404 handler
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global error middleware
app.use(errorHandler);

module.exports = app;
