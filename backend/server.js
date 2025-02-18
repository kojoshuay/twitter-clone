import path from "path";
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
const __dirname = path.resolve()

app.use(express.json({limit:"5mb"})) //to parse req.body
//limit should not be too high to prevetn DoS attacks
app.use(express.urlencoded({ extended: true })) //to parse URL encoded data in the request data (form data)

app.use(cookieParser()) //middleware to parse cookies from incoming requests

app.use("/api/auth", authRoutes) //routes for authentication
app.use("/api/users", userRoutes) //routes for user-related operations
app.use("/api/posts", postRoutes) //routes for profile-related operations
app.use("/api/notifications", notificationRoutes) //routes for notificaiton-related operations

//checks if the application is running in a production environment
//ensures frontend(React app) and backend(Express server) work together
if(process.env.NODE_ENV === "production") {

    //serve static files from the React frontend build folder
    //allows Express to serve the built React files when deployed
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    //handle all unknown GET requests (anything that isn't an API route)
    app.get("*", (req, res) => {

        //send the React application's main index.html file
        //ensures React takes over routing on the frontend
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

//start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
    connectMongoDB();
})