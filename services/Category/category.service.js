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

const DEFAULT_CATEGORY = 'Uncategorized';

class CategoryService {
    static create = async (req) => {
        const { title } = req.body;
       
        // Validate required fields
        if (!title) {
            title = DEFAULT_CATEGORY;
        }

        // Save the category to the database
        const savedCategory = await CategoryModel.create({title, user: req.user.accountID});
        return {
            category: savedCategory
        }
    }

    static fetchAllCategories = async (req) => {
        const categories = await CategoryModel.find({});
        return categories
    }

    static getPostsByCategory = async (req) => {
        const { id } = req.params;

        // Validate category exists
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw new NotFoundError(`Category not found`);
        }
        console.log('im in this')
        // Fetch posts for this category
        const posts = await PostModel.find({ category: id })
            .populate('user', 'username') // Optional: Include user info
            .sort({ createdAt: -1 }); // Sort by newest first
            console.log('Posts fetched:', posts);
        return {
            category: category.title,
            posts
        };
    }

    static updateCategory = async (req) => {
        const { id } = req.params;
        const { title } = req.body;
        if(!title) {
            throw new BadRequestError(`Title is required`);
        }
        const category = await CategoryModel.findById(id);  
        if (!category) {
            throw new NotFoundError(`Category not found`);
        }
        category.title = title;
        await category.save();
        return category
    }

    static deleteCategory = async (req) => {
        const { id } = req.params;
        const category = await CategoryModel.findOne({_id: id, user: req.user.accountID});  
        if (!category) {
            throw new NotFoundError(`Category not found`);
        }
        await CategoryModel.deleteOne({_id: id});
        return category
    }
    
}

module.exports = CategoryService