const express = require('express');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);

// 404 handler
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global error middleware
app.use(errorHandler);

module.exports = app;
