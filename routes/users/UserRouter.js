const express = require('express')
const userRouter = express.Router()
const UserController = require('../../controllers/User/UserController')
const asyncHandler = require(`../../utils/asyncFunctionHandler`)
const authUser = require(`../../middlewares/authUser.middleware`)
const isAdmin = require(`../../middlewares/isAdmin.middleware`)
const multer = require('multer')
const storage = require('../../config/cloudinaryConnect')
const UserModel = require('../../models/User/user.model')

userRouter.post('/register', asyncHandler(UserController.register))
userRouter.post(`/login`, asyncHandler(UserController.login))
userRouter.get(`/forceLogoutFromAllDevices`, asyncHandler(UserController.logoutFromAllDevices))
userRouter.post(`/refreshToken`, asyncHandler(UserController.refreshAccessToken))

userRouter.use(authUser)

userRouter.put(`/adminBlocking/:id`, isAdmin, asyncHandler(UserController.adminBlocking))
userRouter.put(`/adminUnblocking/:id`, isAdmin, asyncHandler(UserController.adminUnblocking))
userRouter.get('/getAllUsersForAdmin', isAdmin, asyncHandler(UserController.getAllUsersForAdmin))
//logout bắt buộc phải là chính chủ + đúng thiết bị
userRouter.post(`/logout`, asyncHandler(UserController.logout))


const upload = multer({ storage }) 
userRouter.get(`/:id`, asyncHandler(UserController.userProfile))
userRouter.put(`/updateProfile`, upload.single('profile') ,asyncHandler(UserController.profileUpdate))
userRouter.get(`/viewers/:id`, asyncHandler(UserController.whoViewMyProfile))
userRouter.get(`/userProfileMini/:id`, asyncHandler(UserController.userProfile))
userRouter.get(`/following/:id`, asyncHandler(UserController.following))
userRouter.get(`/unfollowing/:id`, asyncHandler(UserController.unfollowing))
userRouter.put(`/blocking/:id`, asyncHandler(UserController.blocking))
userRouter.put(`/unblocking/:id`, asyncHandler(UserController.unblocking))
userRouter.put(`/updateEmail`, asyncHandler(UserController.updateEmail))
userRouter.put(`/updatePassword`, asyncHandler(UserController.updatePassword))
userRouter.delete(`/deleteAccount`, asyncHandler(UserController.deleteAccount))

module.exports = userRouter