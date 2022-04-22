const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

function verifyToken(req, res, next) {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).send({ message: 'Unauthorized'})
    }

    const token = authorization.split(" ")[1]
    try {
        const tokenData = jwt.verify(token, JWT_SECRET)
        req.tokenData = tokenData

        if(!tokenData.id) {
            return res.status(401).send({
                message: "Invalid token"
            })
        }

        next()
    } catch (err) {
        return res.status(401).send({
            message: "Invalid token"
        })
    }
}

module.exports = {
    verifyToken
}