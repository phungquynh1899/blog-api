`use strict`
const PostService = require('../../services/Post/Post.service')
const { CREATED, OK } = require("../../response/success.response")
const { validateDataForRegister, validateDataForLogin } = require('../../utils/validator')
const { BadRequestError } = require('../../response/error.response')

class PostController {
    static create = async (req, res, next) => {
        return new CREATED({
            "message": "Post created successfully",
            "metadata": await PostService.create(req)
        })
        .send(res)
    }
    static lastDateUserCreatedPost = async (req, res, next) => {
        return new OK({
            "message": "Last date user created post fetches successfully",
            "metadata": await PostService.lastDateUserCreatedPost(req)
        })
        .send(res)
    }
    static fetchAllPosts = async (req, res, next) => {
        return new OK({
            "message": "All Posts fetched successfully",
            "metadata": await PostService.fetchAllPosts(req)
        })
        .send(res)
    }
    static searchPosts = async (req, res, next) => {
        return new OK({
            "message": "Posts search successfully",
            "metadata": await PostService.searchPosts(req)
        })
        .send(res)
    }


    static like = async (req, res, next) => {
        return new OK({
            "message": "Post liked successfully",
            "metadata": await PostService.like(req)
        })
        .send(res)
    }

    static dislike = async (req, res, next) => {
        return new OK({
            "message": "Post disliked successfully",
            "metadata": await PostService.dislike(req)
        })
        .send(res)
    }

    static getPostById = async (req, res, next) => {
        return new OK({
            "message": "Post fetched successfully",
            "metadata": await PostService.getPostById(req)
        })
        .send(res)
    }

    static deletePost = async (req, res, next) => {
        return new OK({
            "message": "Post deleted successfully",
            "metadata": await PostService.deletePost(req)
        })
        .send(res)
    }

    static updatePost = async (req, res, next) => {
        return new OK({
            "message": "Post updated successfully",
            "metadata": await PostService.updatePost(req)
        })
        .send(res)
    }

}

module.exports = PostController