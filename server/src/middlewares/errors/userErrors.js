/* import EErrors from '../services/errors/enums.js';

const UserErrorMiddleware = (error, req, res, next) => {
    switch (error.code) {
        case EErrors.INVALID_USER_ERROR:
            res.send({ status: "error", error: error.name })
            break;
        case EErrors.INVALID_PRODUCT_ERROR:
            res.send({ status: "error", error: error.name })
            break;
        default:
            res.send({ status: "error", error: "Unhandled error" })
            break;
    }
}

export default UserErrorMiddleware; */