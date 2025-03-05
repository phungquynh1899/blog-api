`use strict`
const CategoryService = require('../../services/Category/Category.service')
const { CREATED, OK } = require("../../response/success.response")
const { validateDataForRegister, validateDataForLogin } = require('../../utils/validator')
const { BadRequestError } = require('../../response/error.response')

class CategoryController {
    static create = async (req, res, next) => {
        return new CREATED({
            "message": "Category created successfully",
            "metadata": await CategoryService.create(req)
        })
        .send(res)
    }

    static fetchAllCategories = async (req, res, next) => {
        return new OK({
            "message": "All categories fetched successfully",
            "metadata": await CategoryService.fetchAllCategories(req)
        })
        .send(res)
    }

    static getPostsByCategory = async (req, res, next) => {
        return new OK({
            "message": "Category fetched successfully",
            "metadata": await CategoryService.getPostsByCategory(req)
        })
        .send(res)
    }

    static updateCategory = async (req, res, next) => {
        return new OK({
            "message": "Category updated successfully",
            "metadata": await CategoryService.updateCategory(req)
        })
        .send(res)
    }

    static deleteCategory = async (req, res, next) => {
        return new OK({
            "message": "Category deleted successfully",
            "metadata": await CategoryService.deleteCategory(req)
        })
        .send(res)
    }


    
}

module.exports = CategoryController