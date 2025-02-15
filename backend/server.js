import express from "express"; //import express for building the server
import dotenv from "dotenv" //import to load environment variables from .env file
import cookieParser from "cookie-parser" //import to parse cookies from incoming requests

//import route handles for different parts of the application
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"

import {v2 as cloudinary} from "cloudinary" //import cloudinary for image uploads

import connectMongoDB from "./db/connectMongoDB.js" //import to connect to MongoDB

dotenv.config() //load environment variables from the .env file into process.env

//configure cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express(); //create instance of the express application
const PORT = process.env.PORT || 5000 //define the port for the server to listen on

app.use(express.json()) //to parse req.body
app.use(express.urlencoded({ extended: true })) //to parse URL encoded data in the request data (form data)

app.use(cookieParser()) //middleware to parse cookies from incoming requests

app.use("/api/auth", authRoutes) //routes for authentication
app.use("/api/users", userRoutes) //routes for user-related operations
app.use("/api/posts", postRoutes) //routes for profile-related operations
app.use("/api/notifications", notificationRoutes) //routes for notificaiton-related operations

//default route to check if the server is running
app.get("/", (req, res) => {
    res.send("server is ready")
})

//start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
    connectMongoDB();
})