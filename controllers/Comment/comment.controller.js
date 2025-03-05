`use strict`
const CommentService = require('../../services/Comment/comment.service')
const { CREATED, OK } = require("../../response/success.response")
const { validateDataForRegister, validateDataForLogin } = require('../../utils/validator')
const { BadRequestError } = require('../../response/error.response')

class CommentController {
    static getAll = async (req, res, next) => {
        return new OK({
            "message": "Comments fetched successfully",
            "metadata": await CommentService.getAll(req)
        })
        .send(res)
    }
    static create = async (req, res, next) => {
        return new CREATED({
            "message": "Comment created successfully",
            "metadata": await CommentService.create(req)
        })
        .send(res)
    }

    static update = async (req, res, next) => {
        return new OK({
            "message": "Comment updated successfully",
            "metadata": await CommentService.update(req)
        })
        .send(res)
    }
    
    static delete = async (req, res, next) => {
        return new OK({
            "message": "Comment deleted successfully",
            "metadata": await CommentService.delete(req)
        })
        .send(res)
    }
}

module.exports = CommentController