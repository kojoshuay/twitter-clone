import mongoose from 'mongoose' //import mongoose for MongoDB connection

const connectMongoDB = async () => {
    try{
        //connect to MongoDB using URI from .env
        const conn = await mongoose.connect(process.env.MONGO_URI)
        //log connection host
        console.log(`MongoDB connected: ${conn.connection.host}`)

    } catch (error) {
        console.error(`Error connection to mongoDB: ${error.message}`)
        process.exit(1)
    }
}

export default connectMongoDB