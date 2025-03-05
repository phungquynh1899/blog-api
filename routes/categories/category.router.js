`use strict`
const express = require(`express`)
const asyncHandler = require("../../utils/asyncFunctionHandler")
const CategoryController = require("../../controllers/Category/category.controller")
const categoryRouter = express.Router()

const authUser = require(`../../middlewares/authUser.middleware`)
const isAdmin = require(`../../middlewares/isAdmin.middleware`)
const multer = require('multer')
const storage = require('../../config/cloudinaryConnect')

categoryRouter.use(authUser)
categoryRouter.get(`/`, asyncHandler(CategoryController.fetchAllCategories))
categoryRouter.get(`/getPostsByCategories/:id`, asyncHandler(CategoryController.getPostsByCategory))

categoryRouter.post(`/create`, asyncHandler(CategoryController.create))
categoryRouter.put(`/updateCategory/:id`, asyncHandler(CategoryController.updateCategory))
categoryRouter.delete(`/deleteCategory/:id`, asyncHandler(CategoryController.deleteCategory))
module.exports = categoryRouter