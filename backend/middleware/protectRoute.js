import User from "../models/user.model.js" //import the User model
import jwt from "jsonwebtoken" //import jsonwebtoken for JWT verification


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt //get the JWT token from the cookies

        if(!token) {
            //return error if no token is provided
            return res.status(401).json({error: "Unauthorized: No Token Provided"})
        }

        //verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) {
            //return error if token is invalid
            return res.status(401).json({error: "Unauthorized: Invalid Token"})
        }

        //find the user by ID and exclude the password
        const user = await User.findById(decoded.userId).select("-password")

        if(!user) {
            //return error if user is not found
            return res.status(404).json({error: "User not found"})
        }

        req.user = user //attach the user to the request object
        next() //proceed to next route handler
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message)
        return res.status(500).json({ error: "internal server error" })
    }
}