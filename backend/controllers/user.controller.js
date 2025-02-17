//models
import Notfiication from "../models/notification.model.js"
import User from "../models/user.model.js"

import bcrypt from 'bcryptjs' //import bcyrpt for password hashing
import {v2 as cloudinary} from "cloudinary" //import cloudinary for image uploads


export const getUserProfile = async (req, res) => {
    const { username } = req.params //get the username from the request parameters

    try {
        //find the user by username and exclude the password
        const user = await User.findOne({ username }).select("-password")

        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json(user)//return user data
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message)
        res.status(500).json({ error: error.message })
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params //extract the user ID to follow/unfollow from request parameters
        const userToModify = await User.findById(id) //find the user to follow/unfollow by their ID
        const currentUser = await User.findById(req.user._id) //find the current authenticated user by their ID

        if(id == req.user._id.toString()) {
            //checks if the user is trying to follow/unfollow themself
            return res.status(400).json({ error: "You can't follow/unfollow yourself" })
        }

        if(!userToModify || !currentUser) {
            //returns an error if either user is not found
            return res.status(400).json({ error: "User not found" })
        }

        //checks if the current user is already following the target user
        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {
            //unfollow the user
            //removes the current user's ID from the target user's followers list
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            //removes the target user's ID from the current user's following list
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id} } )

            res.status(200).json({ message: "User unfollowed successfully" })
        } else {
            //follow the user
            //adds the current user's ID to the target user's followers list
            await User.findByIdAndUpdate(id, { $push: {followers: req.user._id } } )
            //adds the target's ID to the current user's following list
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } } )

            //send notification to the user for the taret user
            const newNotification = new Notfiication({
                type: "follow",
                from: req.user._id, //the user who followed
                to: userToModify._id, //the user being followed
            })

            await newNotification.save() //save the notification to the database

            res.status(200).json({ message: "User followed successfully" })
        }
    } catch (error) {
        console.log("Error in followUnfollowUser: ", error.message)
        res.status(500).json({ error: error.message })
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id //extract the current user's ID

        //find the current user and get the list of users they are already following
        const usersFollowedByMe = await User.findById(userId).select("following")

        //use MongoDB aggregation to randomly sample 10 users
        const users = await User.aggregate([
            {
                $match: { 
                    _id: { $ne: userId }, //exclude the current user
                },
            },
            //randomly select 10 users
            //this is done because at first want to get a lot of sample users
            //later, these sample users are filtered to not include users the current user is already following
            { $sample: { size: 10 } }, 
        ])

        //filter out users that the current user is already following
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id))

        //limit the suggested users to 4
        const suggestedUsers = filteredUsers.slice(0, 4)

        //remove the password field from the suggested users for security
        suggestedUsers.forEach((user) => (user.password = null))

        res.status(200).json(suggestedUsers) //return a list of suggested users
    } catch (error) {
        console.log("Error in SuggestedUsers: ", error.message)
        res.status(500).json({ error: error.message })
    }
}

export const updateUser = async (req, res) => {
    //extract user details from the request body
    const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body

    //extract profile and cover images from the request body
    //"let" allows profileImg and coverImg to be reassigned later (uploading new images to cloudinary)
    let { profileImg, coverImg } = req.body

    const userId = req.user._id //extract the current user's ID

    try {
        let user = await User.findById(userId) //find user by their ID
        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            //checks if the password update request is valid
            return res.status(400).json({ error: "Please provide both current and new password" })
        }

        //if both current password and new password is provided
        if(currentPassword && newPassword) {
            //verify the current password
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch) {
                //if current password typed in and the past password doesn't match, return an error
                return res.status(400).json({ error: "Current password is incorrect" })
            }

            if(newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" })
            }

            //generates a "salt," which is a random value added to the password before hashing
            //if two users have the same password, their hashed passwords will be different
            //"10" is the cost factor, which determines how computationally expensive the hashing process will be
            //higher number, more security and longer time to compile
            const salt = await bcrypt.genSalt(10)

            //takes the password and salt and combines them to make a hash
            //a hash is a random fixed length string of characters
            //ensures that if a database is breached, the passwords are not easily recoverable
            user.password = await bcrypt.hash(newPassword, salt)
        }

        //if a new profileImg is provided
        if(profileImg) {
            
            if(user.profileImg) {
                //delete the old profile image from cloudinary
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }

            //upload the new profile image to cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            //update the profile image url
            profileImg = uploadedResponse.secure_url
        }

        //if a new cover image is provided
        if(coverImg) {
            
            if(user.coverImg) {
                //delete the old cover image from cloudinary
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }

            //upload the new cover image to cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            //update the cover image url
            coverImg = uploadedResponse.secure_url
        }

        //update the user's details with the new values or keep old ones if new values not provided
        user.fullName = fullName || user.fullName
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save() //save the updated user to the database

        //password should be null in response for security
        user.password = null

        return res.status(200).json(user) //return the updated user details
    } catch (error) { 
        console.log("Error in updateUser: ", error.message)
        res.status(500).json({ error: error.message })
    }
}