const { validationResult, query, param } = require('express-validator')
/** @type { import('../db/models').dbModels } */
const models = require('../db/models')

const router = require('express').Router()

const userActionsQuery = [
    param('user_id').notEmpty().isInt().toInt(),
    query('page').default(1).isInt({ min: 1 }),
]

router.get('/:user_id', userActionsQuery, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array()
        })
    }
    const page = req.query.page
    const limit = 10
    console.log(req.params.user_id)
    models.UserActions.findAll({
        where: {
            user_id: req.params.user_id
        },
        limit,
        offset: (req.query.page - 1) * 10
    })
        .then((users) => {
            res.status(200).json({
                status: 'ok',
                pagination: {
                    page,
                    limit: 10
                },
                data: users
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                status: 'error',
                error
            })
        })
})


module.exports = router