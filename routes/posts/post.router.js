`use strict`
const express = require(`express`)
const asyncHandler = require("../../utils/asyncFunctionHandler")
const postController = require("../../controllers/Post/post.controller")
const postRouter = express.Router()

const authUser = require(`../../middlewares/authUser.middleware`)
const isAdmin = require(`../../middlewares/isAdmin.middleware`)
const multer = require('multer')
const storage = require('../../config/cloudinaryConnect')
const UserModel = require('../../models/User/user.model')
//instance of multer
const upload = multer({ storage }) 

postRouter.use(authUser)
postRouter.post(`/create`, upload.single('postPhoto'), asyncHandler(postController.create))
postRouter.post(`/lastDateUserCreatedPost`, asyncHandler(postController.lastDateUserCreatedPost))
postRouter.get(`/fetchAllPosts`, asyncHandler(postController.fetchAllPosts))
postRouter.get(`/search`, asyncHandler(postController.searchPosts))
postRouter.get(`/like/:postID`, asyncHandler(postController.like))
postRouter.get(`/dislike/:postID`, asyncHandler(postController.dislike))
postRouter.get(`/:postID`, asyncHandler(postController.getPostById))
postRouter.delete(`/delete/:postID`, asyncHandler(postController.deletePost))
postRouter.put(`/update/:postID`, upload.single('postPhoto'), asyncHandler(postController.updatePost))



module.exports = postRouter