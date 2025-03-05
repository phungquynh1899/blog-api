"use strict";
const UserModel = require(`../../models/User/user.model`);
const { ConflictError, InternalServerError, BadRequestError, NotFoundError, ForbiddenError, UnauthenticatedError } = require(`../../response/error.response`);
const bcrypt = require(`bcrypt`);
const crypto = require(`crypto`);
const PublicKeyModel = require(`../../models/User/PublicKeyModel`);
const PrivateKeyModel = require(`../../models/User/PrivateKeyModel`);
const RefreshTokenModel = require(`../../models/User/RefreshTokenModel`);
const jwt = require(`jsonwebtoken`);
const { getDataToForResponseObject } = require(`../../utils/ExtractResultByLodashPackage`);
const PostModel = require("../../models/Post/post.model");
const CategoryModel = require("../../models/Category/category.model"); // Added missing import

const DEFAULT_CATEGORY = 'Uncategorized';
class PostService {
    static create = async (req) => {
        const { title, description, category } = req.body;

        // Validate required fields
        if (!title || !description) {
            throw new BadRequestError(`Title and description are required`);
        }

        // Check if user exists
        const user = await UserModel.findById(req.user.accountID);
        if (!user) {
            throw new UnauthenticatedError(`User not found`);
        }

        // Check if user has been blocked
        if (user.isBlocked) {
            throw new ForbiddenError(`User is blocked`);
        }

        // Handle category (case-insensitive)
        let categoryId = null;
        const categoryTitle = category || DEFAULT_CATEGORY; // Use Uncategorized if no category provided
        if (categoryTitle) {
            // Search for existing category (case-insensitive)
            let categoryExists = await CategoryModel.findOne({
                title: { $regex: new RegExp(`^${categoryTitle}$`, "i") }
            });

            if (!categoryExists) {
                // Create new category if it doesn’t exist
                categoryExists = await CategoryModel.create({ title: categoryTitle });
            }
            categoryId = categoryExists._id;
        }

        // Create new post with categoryId (ObjectId or null)
        const newPost = {
            title,
            description,
            category: categoryId,
            user: req.user.accountID,
            photo: req?.file?.path || ""
        };

        // Save the post to the database
        const savedPost = await PostModel.create(newPost);

        // Add the post to the user's `posts` array
        user.posts.push(savedPost._id);
        await user.save();

        return {
            post: savedPost
        };
    }

    static lastDateUserCreatedPost = async (req) => {
        const user = await UserModel.findOne({ _id: req.user.accountID });
        return {
            "lastDateUserCreatedPost": getDataToForResponseObject(["daysAgo"], user)
        };
    }

    static fetchAllPosts = async (req) => {
        const allPosts = await PostModel.find()
            .populate('user')
            .populate('category', 'title'); // Already correctly populating category
        // Check if I'm blocked by the author of the post
        const filteredPosts = allPosts.filter(post => post.user && !post.user.blocked.includes(req.user.accountID));
        return filteredPosts;
    }

    static searchPosts = async (req) => {
        const { keyword } = req.query;
      
        if (!keyword) {
          throw new BadRequestError("Keyword is required for search");
        }
      
        const posts = await PostModel.find({
          description: { $regex: new RegExp(keyword, "i") },
        })
          .populate("user", "username")
          .populate("category", "title") // Added to match UI
          .sort({ createdAt: -1 });
          console.log(posts)
        return posts
      };

    static like = async (req) => {
        const post = await PostModel.findById(req.params.postID);
        if (!post) {
            throw new NotFoundError(`Post not found`);
        }

        // Check if the user has already liked the post
        if (post.likes.includes(req.user.accountID)) {
            post.likes = post.likes.filter(like => like.toString() !== req.user.accountID);
        } else {
            post.likes.push(req.user.accountID);
        }

        await post.save();
        return post;
    }

    static dislike = async (req) => {
        const post = await PostModel.findById(req.params.postID);
        if (!post) {
            throw new NotFoundError(`Post not found`);
        }

        // Check if the user has already disliked the post
        if (post.dislikes.includes(req.user.accountID)) {
            post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== req.user.accountID);
        } else {
            post.dislikes.push(req.user.accountID);
        }

        await post.save();
        return post;
    }

    static getPostById = async (req) => {
        const post = await PostModel.findById(req.params.postID).populate('category', 'title');
        if (!post) {
            throw new NotFoundError(`Post not found`);
        }
        const isViewedByThisUser = post.numViews.includes(req.user.accountID);
        if (!isViewedByThisUser) {
            post.numViews.push(req.user.accountID);
            await post.save();
        }
        return post;
    }

    static deletePost = async (req) => {
        const post = await PostModel.findById(req.params.postID);
        if (!post) {
            throw new NotFoundError(`Post not found`);
        }

        // Check if the user is the author of the post
        if (post.user.toString() !== req.user.accountID) {
            throw new ForbiddenError(`You are not the author of this post`);
        }

        // Delete the post
        await PostModel.findByIdAndDelete(req.params.postID);
        return post;
    }

    static updatePost = async (req) => {
        const post = await PostModel.findById(req.params.postID);
        if (!post) {
            throw new NotFoundError(`Post not found`);
        }
    
        // Check if the user is the author of the post
        if (post.user.toString() !== req.user.accountID) {
            throw new ForbiddenError(`You are not the author of this post`);
        }

        // Validate category if provided
        if (req.body.category && req.body.category !== 'undefined') {
            const categoryExists = await CategoryModel.findById(req.body.category);
            if (!categoryExists) {
                throw new NotFoundError(`Category not found`);
            }
            post.category = req.body.category;
        } else if (req.body.category === null || req.body.category === 'undefined') {
            post.category = null; // Allow clearing the category
        }

        // Only update fields that are actually provided in the request
        if (req.body.title) post.title = req.body.title;
        if (req.body.description) post.description = req.body.description;
        if (req?.file?.path) post.photo = req.file.path;

        await post.save();
        return post;
    }
}

module.exports = PostService;