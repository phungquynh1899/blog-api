const mongoose = require('mongoose')

//kết nối đến mongodb
const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to database')
    }catch(error){
        console.log(error.message)
        process.exit(1)
    }
}
dbConnect()