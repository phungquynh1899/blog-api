`use strict`
const jwt = require('jsonwebtoken');
const { UnauthenticatedError, UnauthorizeError } = require('../response/error.response');
const PublicKeyModel = require('../models/User/PublicKeyModel');

const authUser = async (req, res, next) => {
    try {
        
        // Check for access token in the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const accessToken = authHeader.split(' ')[1];

        // Decode token first to get account ID
        const decoded = jwt.decode(accessToken);
        if (!decoded) {
            throw new UnauthorizeError('Invalid token format');
        }

        const publicKeyDoc = await PublicKeyModel.findOne({ accountID: decoded.accountID });
        if (!publicKeyDoc) {
            throw new UnauthorizeError('Public key not found');
        }


        // Verify token with the stored public key
        const verified = jwt.verify(accessToken, publicKeyDoc.publicKey, { algorithms: ['RS256'] });
        req.user = {
            accountID: verified.accountID,
            email: verified.email,
            deviceId: verified.deviceId
        };
 
        next();

    } catch (error) {
        console.log(error)
        console.log('im the error in authUser')
        if (error instanceof jwt.TokenExpiredError) {
            return next(new UnauthenticatedError('Token expired, please refresh')); // ✅ Returns 401
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new UnauthenticatedError('Invalid token signature')); // ✅ Returns 401 instead of 500
        }

        if (error instanceof jwt.NotBeforeError) {
            return next(new UnauthenticatedError('Token not active yet')); // ✅ 401
        }
        if (error instanceof SyntaxError) {
            return res.status(400).json({ error: 'Invalid token format' }); // ✅ 400
        }
        return next(error);
    }
};


module.exports = authUser;
//access token hết hạn sử dụng thì hướng dẫn frontend gửi refresh token lại
