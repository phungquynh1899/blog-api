`use strict`
const UserService = require('../../services/User/User.service')
const { CREATED, OK } = require("../../response/success.response")
const { validateDataForRegister, validateDataForLogin, validateDataForUpdateEmail } = require('../../utils/validator')
const { BadRequestError } = require('../../response/error.response')

class UserController {
    static register = async (req, res, next) => {
        //kiểm tra các trường dữ liệu
        if (validateDataForRegister(req)) {
            return new CREATED({
                "message": "Register successfully, please login",
                "metadata": await UserService.register(req.body)
            }).
                send(res)
        }

    }

    static login = async (req, res, next) => {
        if(validateDataForLogin(req)){
            return new OK({
                "message": `Login successfully`,
                "metadata": await UserService.login(req.body)
            })
            .send(res)
            //kiểm tra email, password có trong database
            //đúng thì cấp lại rt,at
        }
    }

    static logout = async (req, res, next) => {
            return new OK({
                "message": `Logout successfully`,
                "metadata": await UserService.logout(req.user)
            })
            .send(res)
    }

    static logoutFromAllDevices = async (req, res, next) => {
        return new OK({
            "message": await UserService.logoutFromAllDevices(req.body)
        })
        .send(res)
}
    
    static refreshAccessToken = async (req, res, next ) => {
        return new CREATED({
            "message" : `New access token created`,
            "metadata": await UserService.refreshAccessToken(req.body)
        }).send(res)
    }
    static profileUpdate = async (req, res, next) => {
        return new OK({
            "message" : `Update user's profile successfully`,
            "metadata": await UserService.profileUpdate(req)
        }).send(res)
    }
    static whoViewMyProfile = async (req, res, next) => {
        return new OK({
            "message" : `OK`,
            "metadata": await UserService.whoViewMyProfile(req) 
        }).send(res)
    }
    static userProfile = async (req, res, next) => {
        return new OK({
            "message" : `OK`,
            "metadata": await UserService.userProfile(req) 
        }).send(res)
    }
    static following = async (req, res, next) => {
        return new OK({
            "message" : `Following successfully`,
            "metadata": await UserService.following(req) 
        }).send(res)
    }
    static unfollowing = async (req, res, next) => {
        return new OK({
            "message" : `Unfollowing successfully`,
            "metadata": await UserService.unfollowing(req) 
        }).send(res)
    }
    static blocking = async (req, res, next) => {
        return new OK({
            "message" : `Blocking successfully`,
            "metadata": await UserService.blocking(req) 
        }).send(res)
    }
    static unblocking = async (req, res, next) => {
        return new OK({
            "message" : `Unblocking successfully`,
            "metadata": await UserService.unblocking(req) 
        }).send(res)
    }

    static adminBlocking = async (req, res, next) => {
        return new OK({
            "message" : `Admin blocking successfully`,
            "metadata": await UserService.adminBlocking(req) 
        }).send(res)
    }

    static adminUnblocking = async (req, res, next) => {
        return new OK({
            "message" : `Admin unblocking successfully`,
            "metadata": await UserService.adminUnblocking(req) 
        }).send(res)
    }

    static updateEmail = async (req, res, next) => {
        if(validateDataForUpdateEmail(req)){
            return new OK({
                "message" : `Email changed successfully`,
                "metadata": await UserService.updateEmail(req) 
            }).send(res)
        }
    }
    static updatePassword = async (req, res, next) => {
        return new OK({
            "message" : `Password changed successfully`,
            "metadata": await UserService.updatePassword(req) 
        }).send(res)
    }
    static deleteAccount = async (req, res, next) => {
        return new OK({
            "message" : `Account deleted successfully`,
            "metadata": await UserService.deleteAccount(req) 
        }).send(res)
    }
    static getAllUsersForAdmin = async (req, res, next) => {
        return new OK({
            "message" : `Fetched users for admin successfully`,
            "metadata": await UserService.getAllUsersForAdmin(req) 
        }).send(res)
    }



}

module.exports = UserController