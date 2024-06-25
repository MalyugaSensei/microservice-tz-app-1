const { body, validationResult, query, param } = require('express-validator')
/** @type { import('../db/models').dbModels } */
const models = require('../db/models')

const router = require('express').Router()

const userActionsQuery = [
    param('uset_id').isInt(),
    query('page').isInt({ min: 1 }),
]

router.get('/:user_id', userActionsQuery, (req, res) => {
    const errors = validationResult(req)
    if (!errors) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
    }
    models.UserActions.findAll()
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


module.exports = router