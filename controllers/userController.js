const AppError = require('../utils/AppError');

exports.getUsers = async (req, res) => {
    // Simulate database call
    const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ];

    res.status(200).json({
        status: 'success',
        data: users
    });
};

exports.getUserById = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const user = { id: 2, name: 'John' };

    if (id !== user.id) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
};
