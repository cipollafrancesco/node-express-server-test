const jwt = require('jsonwebtoken')

/**
 * CHECKS JWT TOKEN
 */
module.exports = (req, res, next) => {
    try {
        req.userData = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_KEY)
    } catch (e) {
        return res.status(401).json({body: null, message: 'Ops! Auth failed'})
    }

    // Go to next handler
    next()
}