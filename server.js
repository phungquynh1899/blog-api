const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
require('./config/dbConnect')
const userRouter = require('./routes/users/UserRouter')
const postRouter = require('./routes/posts/post.router')
const categoryRouter = require('./routes/categories/category.router')
const commentRouter = require('./routes/comments/comment.router')
const { NotFoundError } = require('./response/error.response')
const cors = require("cors"); 
const morgan = require("morgan")
app.use(cors()); 

// middleware 
app.use(express.json())
app.use(morgan('dev'))
//routes
//user's routes
app.use('/api/v1/users/', userRouter)
//post's routes
app.use('/api/v1/posts/', postRouter)
//comment's routes
app.use('/api/v1/comments/', commentRouter)
//category's routes
app.use('/api/v1/categories/', categoryRouter)


//error handling
//not found url error (không rớt vào cái link nào nên mới rớt vô cái middleware này)
app.use((req, res, next) => {
    const NotFound = new NotFoundError()
    next(NotFound) //thảy cho error handling kế tiếp
})
//error occurs in the execution of some url  
app.use((error, req, res, next) => {
    console.log(error)
    console.log(error.message)
    console.log(error.status)
    const statusCode = error.status || 500
    res.status(statusCode).json({
        "error": error.message || "Internal server error",
    }
    )
})
const PORT = process.env.PORT || 8888

app.listen(PORT, () => {
    console.log('Blog is running at PORT ' + PORT)
})