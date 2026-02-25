const { body } = require('express-validator');

const registerValidation = [
    body('name', 'Name is required').not().isEmpty(),
    body('name', 'Name must contain only alphabets').matches(/^[a-zA-Z\s]+$/),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
];

const profileUpdateValidation = [
    body('name', 'Name is required').not().isEmpty(),
    body('name', 'Name must contain only alphabets').matches(/^[a-zA-Z\s]+$/),
    body('email', 'Please include a valid email').isEmail()
];

module.exports = {
    registerValidation,
    loginValidation,
    profileUpdateValidation
};
