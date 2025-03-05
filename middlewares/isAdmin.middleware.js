`use strict`
console.log("🔹 isAdmin middleware loaded");

const UserModel = require("../models/User/user.model");
const { ForbiddenError, UnauthenticatedError } = require("../response/error.response");

const isAdmin = async (req, res, next) => {
    console.log('im in admin middleware')
    try {
        console.log('end admin check')
        // Ensure user authentication is valid
        if (!req.user || !req.user.accountID) {
            throw new UnauthenticatedError('User not found');
        }

        // Fetch the user from the database
        const user = await UserModel.findById(req.user.accountID);
        if (!user) {
            throw new UnauthenticatedError('User not found');
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            throw new ForbiddenError('Access denied: Admins only');
        }
        console.log('end admin check')
        // Proceed to the next middleware
        next();
    } catch (error) {
        next(error); // Let your global error handler handle it
    }
};

module.exports = isAdmin;
