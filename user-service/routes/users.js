const { body, validationResult, query, check, oneOf } = require('express-validator')
/** @type { import('../db/models').dbModels } */
const models = require('../db/models')
const { sendDataToQueue } = require('../amqp/publishers/send')

const router = require('express').Router()

const usersQuery = [
    query('limit').default(10).isInt({ min: 10 }),
    query('page').default(1).isInt({ min: 1 })
];

router.get('/', usersQuery, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
        return
    }

    const page = req.query.page
    const limit = req.query.limit
    console.log(page, limit)
    const offset = (page - 1) * limit
    console.log(page, limit, offset)
    models.User.findAll({
        offset,
        limit
    })
        .then((users) => {
            console.log(users)
            res.status(200).json({
                status: 'ok',
                pagination: {
                    page,
                    limit
                },
                data: users
            })
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json({
                status: 'error',
                error: error.message
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

const createUsersValidator = [
    body().isArray().withMessage('Must be an array'),
    check('*.firstName', 'First name must be a not empty string').isString(),
    check('*.lastName', 'Last name must be a not empty string').isString(),
    check('*.age', 'Age must be a number').isNumeric(),
    check('*.gender', 'Gender must be a not empty string').isString(),
    check('*.problems', 'Problems must be a boolean').optional().isBoolean()
];

router.post('/',
    oneOf([
        createUserValidator,
        createUsersValidator
    ]), (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                status: 'error',
                errors: errors.array()
            })
            return
        }

        if (!Array.isArray(req.body)) {
            models.User.create(req.body)
                .then((user) => {
                    let queueData = {
                        user_id: user.id,
                        action: 'create',
                    }
                    return sendDataToQueue('user-actions', queueData).then(() => user)
                })
                .then((user) => {
                    res.status(201).json({
                        status: 'ok',
                        data: user
                    })
                })
                .catch((error) => {
                    console.error(error)
                    res.status(500).json({
                        status: 'error',
                        error: error.message
                    })
                })
            return;
        }

        models.User.bulkCreate(req.body)
            .then((users) => {
                let queueData = []
                users.forEach((user) => {
                    queueData.push({
                        user_id: user.id,
                        action: 'create',
                    })
                })

                return sendDataToQueue('user-actions', queueData).then(() => users)
            })
            .then((user) => {
                res.status(201).json({
                    status: 'ok',
                    data: user
                })
            })
            .catch((error) => {
                console.error(error)
                res.status(500).json({
                    status: 'error',
                    error: error.message
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
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
        return
    }

    models.User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then((user) => {
            let queueData = {
                user_id: req.params.id,
                action: 'update',
                additional_data: Object.keys(req.body).filter(key => key !== 'id'),
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
            console.error(error)
            res.status(500).json({
                status: 'error',
                error: error.message
            })
        })

    return;

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
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
        return
    }

    models.User.update(req.body, {
        where: {
            id: req.params.id
        },
        returning: true
    })
        .then((user) => {
            let queueData = {
                user_id: req.params.id,
                action: 'update',
                additional_data: Object.keys(req.body).filter(key => key !== 'id'),
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
            console.error(error)
            res.status(500).json({
                status: 'error',
                error: error.message
            })
        })
    return;
})

module.exports = router
