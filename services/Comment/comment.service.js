`use strict`
const UserModel = require(`../../models/User/user.model`)
const { ConflictError, InternalServerError, BadRequestError, NotFoundError, ForbiddenError, UnauthenticatedError } = require(`../../response/error.response`)
const bcrypt = require(`bcrypt`)
const crypto = require(`crypto`)
const PublicKeyModel = require(`../../models/User/PublicKeyModel`)
const PrivateKeyModel = require(`../../models/User/PrivateKeyModel`)
const RefreshTokenModel = require(`../../models/User/RefreshTokenModel`)
const jwt = require(`jsonwebtoken`)
const { getDataToForResponseObject } = require(`../../utils/ExtractResultByLodashPackage`)
const PostModel = require("../../models/Post/post.model")
const CategoryModel = require("../../models/Category/category.model")
const CommentModel = require("../../models/Comment/comment.model")

class CommentService {
    static getAll = async (req) => {
        const comments = await CommentModel.find({ post: req.params.postId }).populate('user', 'firstName')
        // populate("user", "firstName lastName"); co loi xay ra, khong ro nguyen nhan
       
        console.log('im in comment service, getAll funciton ')
        console.log(comments)
        return comments
    }
    static create = async (req) => {
        const { postId } = req.params
        const { comment } = req.body

        const post = await PostModel.findById(postId)
        if (!post) throw new NotFoundError(`Post not found`)
        const user = await UserModel.findById(req.user.accountID)
        if (!user) throw new NotFoundError(`User not found`)
        const newComment = await CommentModel.create({
            post: postId,
            user: req.user.accountID,
            description: comment
        })
        post.comments.push(newComment._id)
        user.comments.push(newComment._id)
        await post.save()
        await user.save()
        return newComment
    }
    static update = async (req) => {
        const { commentId } = req.params
        const { comment } = req.body
        const commentFound = await CommentModel.findById(commentId)
        if (!commentFound) throw new NotFoundError(`Comment not found`)
        if (commentFound.user.toString() !== req.user.accountID) throw new ForbiddenError(`You are not allowed to update this comment`)
        commentFound.description = comment
        await commentFound.save()   
        return commentFound
    }

    static delete = async (req) => {
        const { commentId } = req.params
        const commentFound = await CommentModel.findById(commentId)
        if (!commentFound) throw new NotFoundError(`Comment not found`)
        if (commentFound.user.toString() !== req.user.accountID) throw new ForbiddenError(`You are not allowed to delete this comment`)
        await CommentModel.findByIdAndDelete(commentId)
        return 
    }
}

module.exports = CommentService