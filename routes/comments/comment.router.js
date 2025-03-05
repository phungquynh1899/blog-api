`use strict`
const express = require(`express`)
const asyncHandler = require("../../utils/asyncFunctionHandler")
const commentController = require("../../controllers/Comment/comment.controller")
const commentRouter = express.Router()

const authUser = require(`../../middlewares/authUser.middleware`)
const isAdmin = require(`../../middlewares/isAdmin.middleware`)
const multer = require('multer')
const storage = require('../../config/cloudinaryConnect')
const UserModel = require('../../models/User/user.model')

commentRouter.use(authUser)
commentRouter.get(`/:postId`, asyncHandler(commentController.getAll))
commentRouter.post(`/create/:postId`, asyncHandler(commentController.create))
commentRouter.put(`/update/:commentId`, asyncHandler(commentController.update))
commentRouter.delete(`/delete/:commentId`, asyncHandler(commentController.delete))
module.exports = commentRouter