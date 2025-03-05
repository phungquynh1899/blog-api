const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Post's title is required"],
        trim: true
    },
    description: {
        type: String, 
        required: [true, "Post's description is required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        
    },
    numViews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }], 
    likes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Post's author is required"
        ]
    }, 
    photo: {
        type: String, 
        
    }

},{
    timestamps: true,
    toJSON: {
        virtuals: true
    }

})

postSchema.pre("find", function(next){
    postSchema.virtual('numViewsCount').get(function(){
        const post = this
        return post.numViews.length
    })
    postSchema.virtual('likesCount').get(function(){
        return this.likes.length
    })
    postSchema.virtual('dislikesCount').get(function(){
        return this.dislikes.length
    })

    postSchema.virtual('likesPercentage').get(function(){
        const post = this
        const likes = post.likes.length
        const dislikes = post.dislikes.length
        const total = likes + dislikes
        if(total === 0){
            return 0
        }
        return `${Math.floor((likes / total) * 100)}%`
    })

    postSchema.virtual(`daysAgo`).get(function(){
        const post = this
        const date = new Date(post.createdAt)
        const now = new Date()
        const difference = now - date
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        return days === 0 ? `Today` : days === 1 ? `Yesterday` : `${days} days ago`
    })

    next()
}
)



const PostModel = mongoose.model('Post', postSchema)

module.exports = PostModel