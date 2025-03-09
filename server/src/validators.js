import { body, param, validationResult } from 'express-validator';
import * as env from './env.js';
import * as utils from './utils.js';
import * as constants from './constants.js';
import { StatusCodes } from 'http-status-codes';

export const register = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name should be a string')
    ,
    body('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid Email format')
    ,
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
    // .isStrongPassword({
    //     minLength: 8,
    //     minLowercase: 1,
    //     minUppercase: 1,
    //     minNumbers: 1,
    //     minSymbols: 1,
    //     returnScore: false,
    // }).withMessage("Password is not strong enough")
    ,
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
    ,
    body('bio')
        .optional()
        .trim()
        .isString().withMessage('Bio should be a string')
    ,
    body('skills')
        .isArray().withMessage('Skills should be an array')
        .custom(value => value.every(skill => typeof skill === 'string'))
        .withMessage('Each skill should be a string.')
    ,
    body('causesSupport')
        .isArray().withMessage('Causes Support should be an array')
        .custom(val => val.every(cause => constants.CATEGORY.includes(cause)))
        .withMessage('Each cause should be a valid cause')
    ,
]

export const login = [
    body('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid Email format')
    ,
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
]

export const updateUser = [
    body('name')
        .optional()
        .trim()
        .isString().withMessage('Name should be a string')
    ,
    body('email')
        .optional()
        .trim()
        .toLowerCase()
        .isEmail().withMessage('Invalid Email format')
    ,
    body('location')
        .optional()
        .trim()
    ,
    body('bio')
        .optional()
        .trim()
        .isString().withMessage('Bio should be a string')
    ,
    body('skills')
        .optional()
        .isArray().withMessage('Skills should be an array')
        .custom(value => value.every(skill => typeof skill === 'string'))
        .withMessage('Each skill should be a string.')
    ,
    body('causesSupport')
        .optional()
        .isArray().withMessage('Causes Support should be an array')
        .custom(val => val.every(cause => constants.CATEGORY.includes(cause)))
        .withMessage('Each cause should be a valid cause')
    ,
    
]

export const createEvent = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title should be a string')
        .isLength({ max: 200 }).withMessage('Title should be less than 200 characters')
    ,
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description should be a string')
        .isLength({ max: 1000 }).withMessage('Description should be less than 1000 characters')
    ,
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date format')
    ,
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
    ,
    body('category')
        .notEmpty().withMessage('Category is required')
        .isString().withMessage('Category should be a string')
        .custom(value => constants.CATEGORY.includes(value))
        .withMessage('Invalid Category')
]

export const getEvent = [
    param('eventId')
        .notEmpty().withMessage('Event ID is required')
        .isMongoId().withMessage('Invalid Event ID')
]

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
}
