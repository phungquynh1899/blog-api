const mongoose = require('mongoose')
const asyncHandler = require('../../utils/asyncFunctionHandler')
const PostModel = require('../Post/post.model')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: 'New User'
    },
    lastName: {
        type: String,
        default: ''
    },
    profilePhoto: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/v1699999999/sample.jpg'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor']
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    follower: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    active: {
        type: Boolean,
        default: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    plan: {
        type: String,
        enum: ['Free', 'Premium', 'Pro'],
        default: 'Free'
    },
    userAward: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//tại sao dùng pre hook mà không dùng virtuals? 
//vì virtuals không hỗ trợ async function
userSchema.pre("findOne", async function (next) {
    // Skip middleware if `skipMiddleware` flag is set in the query
    if (this.getQuery().skipMiddleware) {
        return next();
    }
   
    this.populate('posts');
    const userId = this.getQuery()._id;

    if (!userId) return next(); 

    const latestPost = await PostModel.findOne({ user: userId }).sort({ createdAt: -1 });

    userSchema.virtual("lastPostDate").get(function () {
        return latestPost ? new Date(latestPost.createdAt).toDateString() : null;
    })

    //check if user is inactivated in 30 days
    const currentDate = new Date();
    const diff = currentDate - latestPost?.createdAt;
    const days = diff / (1000 * 60 * 60 * 24);
    

    userSchema.virtual("isInactivated").get(function () {
        return days > 30;
    });

    //last active date
    if(days < 1){
        userSchema.virtual("lastActive").get(function () {
            return "Today";
        })
    }
    else if(days < 2){
        userSchema.virtual("lastActive").get(function () {
            return "Yesterday";
        })
    }
    else{
        userSchema.virtual("lastActive").get(function () {
            return `${Math.floor(days)} days ago`;
        })
    }
    //update the user's award by the number of posts
    const posts = await PostModel.find({ user: userId });
    if(posts.length < 10 ){
        await UserModel.findByIdAndUpdate(userId, { userAward: 'Bronze' }, { new: true });
    } 
    else if(posts.length < 20){
        await UserModel.findByIdAndUpdate(userId, { userAward: 'Silver' }, { new: true });  
    }
    else {
        await UserModel.findByIdAndUpdate(userId, { userAward: 'Gold' }, { new: true });   
    }

    next();
});


//tạo 1 trường dữ liệu mới từ các trường dữ liệu đã có trong schema User
userSchema.virtual("fullname").get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

//truờng dữ liệu mới là tên viết tắt hai chữ cái đầu của họ tên
userSchema.virtual("initials").get(function () {
    const firstInitial = this.firstName ? this.firstName.charAt(0) : '';
    const lastInitial = this.lastName ? this.lastName.charAt(0) : '';
    return `${firstInitial} ${lastInitial}`.trim();
});
//trường dữ liệu đếm số bài post
userSchema.virtual("postCount").get(function () {
    return this.posts ? this.posts.length : 0
});
userSchema.virtual("followerCount").get(function () {
    return this.follower? this.follower.length : 0;
});
userSchema.virtual("followingCount").get(function () {
    return this.following ? this.following.length : 0;
});
userSchema.virtual("viewCount").get(function () {
    return this.viewers ? this.viewers.length : 0;
});
userSchema.virtual("blockedCount").get(function () {
    return this.blocked ? this.blocked.length : 0;
});



const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel

