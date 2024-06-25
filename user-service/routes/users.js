const { body, validationResult, query } = require('express-validator')
/** @type { import('../db/models').dbModels } */
const models = require('../db/models')
const { sendDataToQueue } = require('amqp/send')

const router = require('express').Router()

const usersQuery = [
    query("limit").isInt({ min: 10 }).default(10),
]

router.get('/', usersQuery, (req, res) => {
    models.User.findAll()
        .then((users) => {
            res.status(200).json({
                status: 'ok',
                data: users
            })
        })
        .catch((error) => {
            res.status(500).json({
                status: 'error',
                error
            })
        })
})

const createUserValidator = [
    body('firstName', 'First name must be a not empty string').isString().notEmpty(),
    body('lastName', 'Last name must be a not empty string').isString().notEmpty(),
    body('age', 'Age must be a number').isNumeric().notEmpty(),
    body('gender', 'Gender must be a not empty string').isString().notEmpty(),
    body('problems', 'Problems must be a boolean').optional().isBoolean().notEmpty()
]

router.post('/', createUserValidator, (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
    }
    models.User.create(req.body)
        .then((user) => {
            let queueData = {
                user_id: user.id,
                action: 'create',
            }
            sendDataToQueue('user-actions', queueData)
        })
        .then((user) => {
            res.status(201).json({
                status: 'ok',
                data: user
            })
        })
        .catch((error) => {
            res.status(500).json({
                status: 'error',
                error
            })
        })
})

const updateUserValidator = [
    body('firstName', 'First name must be a not empty string').isString().notEmpty(),
    body('lastName', 'Last name must be a not empty string').isString().notEmpty(),
    body('age', 'Age must be a number').isNumeric().notEmpty(),
    body('gender', 'Gender must be a not empty string').isString().notEmpty(),
    body('problems', 'Problems must be a boolean').isBoolean().notEmpty()
]

router.put('/:id', updateUserValidator, (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
    }

    models.User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then((user) => {
            let queueData = {
                user_id: user.id,
                action: 'update',
                additional_data: Object.keys(req.body),
            }
            sendDataToQueue('user-actions', queueData)
        })
        .then((user) => {
            res.status(200).json({
                status: 'ok',
                data: user
            })
        })
        .catch((error) => {
            res.status(500).json({
                status: 'error',
                error
            })
        })
})

const updateOptionalUserValidator = [
    body('firstName', 'First name must be a not empty string').optional().isString().notEmpty(),
    body('lastName', 'Last name must be a not empty string').optional().isString().notEmpty(),
    body('age', 'Age must be a number').optional().isNumeric().notEmpty(),
    body('gender', 'Gender must be a not empty string').optional().isString().notEmpty(),
    body('problems', 'Problems must be a boolean').optional().isBoolean().notEmpty()
]


router.patch('/:id', updateOptionalUserValidator, (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
    }

    models.User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then((user) => {
            let queueData = {
                user_id: user.id,
                action: 'update',
                additional_data: Object.keys(req.body),
            }
            return sendDataToQueue('user-actions', queueData).then(() => user)
        })
        .then((user) => {
            res.status(200).json({
                status: 'ok',
                data: user
            })
        })
        .catch((error) => {
            res.status(500).json({
                status: 'error',
                error
            })
        })
})

module.exports = router