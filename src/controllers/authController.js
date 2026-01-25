const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');

const logger = require('../config/logger');

logger.info({
    event: 'User login',
    userId: user._id,
    email: user.email,
    ip: req.ip
});
logger.warn({
    event: 'Failed login attempt',
    email,
    ip: req.ip
});


const signAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES
    });
};

const signRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES
    });
};


exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    const token = signToken(user._id);

    res.status(201).json({
        status: 'success',
        token
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and password required', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password))) {
        return next(new AppError('Invalid credentials', 401));
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        status: 'success',
        accessToken
    });
};


exports.logout = async (req, res, next) => {
    const token = req.cookies.refreshToken;

    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            user.refreshToken = null;
            await user.save({ validateBeforeSave: false });
        }
    }

    res.clearCookie('refreshToken');

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
};



exports.refreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return next(new AppError('No refresh token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
        return next(new AppError('Invalid refresh token', 403));
    }

    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        status: 'success',
        accessToken: newAccessToken
    });
};
