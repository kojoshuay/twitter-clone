//import the function to generate and set JWT token
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js'

//import user model
import User from '../models/user.model.js'

//import bcrypt for password hasing
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    try{

        //destructure the request body
        const {fullName, username, email, password} = req.body

        //regular expression to validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            //return error if email format is invalid
            return res.status(400).json({ error: "invalid email format" })
        }

        //checks if the username already exists
        const existingUser = await User.findOne({ username })
        if(existingUser){
            //return error if username is taken
            return res.status(400).json({ error: "username is already taken "})
        }

        //checks if the email already exists
        const existingEmail = await User.findOne({ email })
        if(existingUser){
            //return error if email is taken
            return res.status(400).json({ error: "email is already taken "})
        }

        if(password.length < 6){
            //return error if password is too short
            return res.status(400).json({ error: "password is too short" })
        }
    
        //generates a "salt," which is a random value added to the password before hashing
        //if two users have the same password, their hashed passwords will be different
        //"10" is the cost factor, which determines how computationally expensive the hashing process will be
        //higher number, more security and longer time to compile
        const salt = await bcrypt.genSalt(10)

        //takes the password and salt and combines them to make a hash
        //a hash is a random fixed length string of characters
        //ensures that if a database is breached, the passwords are not easily recoverable 
        const hashedPassword = await bcrypt.hash(password, salt)

        //create a new user instance
        const newUser = new User( {
            fullName,
            username,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res) //generate and set JWT token
            await newUser.save() //save new user to database

            //return new user data
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                comverImg: newUser.coverImg,
            })
        } else {
            //return error if new user data is invalid
            res.status(400).json({ error: "invalud user data" })
        }

    } catch (error) {
        console.log("error in signup controller", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body //destructure the request body

        const user = await User.findOne({username}) //find user by username

        //compare the provided password with the hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect) {
            //return error if username or password is incorrect
            return res.status(400).json({error: "invalid username or password"})
        }

        generateTokenAndSetCookie(user._id, res) //generate and set JWT token

        //return user data
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            proileImg: user.profileImg,
            comverImg: user.coverImg,
        })

    } catch (error) {
        console.log("error in login controller", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0}) //clear JWT cookie
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ error: "internal server error"})
    }
}

export const getMe = async (req, res) => {
    try{
        //find the user by the ID and execlude the password
        const user = await User.findById(req.user._id).select("-password")

        res.status(200).json(user) //return user data
    } catch (error) {
        console.log("Error in getMe controller", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}