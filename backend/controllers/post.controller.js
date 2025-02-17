import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Notfiication from "../models/notification.model.js"
import {v2 as cloudinary} from 'cloudinary' //import cloudinary for image uploads

export const createPost = async (req, res) => {
    try {
        const { text } = req.body //destructure the request body
        let { img } = req.body //destructure the image from the request body
        const userId = req.user._id.toString() //get the usr ID from the request

        const user = await User.findById(userId) //find user by ID

        if(!user) {
            return res.status(404).json({message: "User not found"})
        }

        if(!text && !img) {
            //the post doesnt have text and a image, return an error
            return res.status(400).json({ error: "Post must have text or image"})
        }

        if(img) {
            //upload image to cloudinary
            const uploadedResonse = await cloudinary.uploader.upload(img)
            //get the secure url of the uploaded image
            img = uploadedResonse.secure_url
        }

        //create a new post instance
        const newPost = new Post({ 
            user:userId,
            text,
            img
        })

        await newPost.save() //save new post to database
        res.status(201).json(newPost) //return new post data
    } catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.log("Error in createPost controller: ", error)
    }
}

export const deletePost = async (req, res) => {
    try {
        //find the post by its ID from the request parameters
        const post = await Post.findById(req.params.id)

        if(!post) {
            //if the post doesn't exist, return an error
            return res.status(404).json({error: "Post not found"})
        }

        if(post.user.toString() !== req.user._id.toString()) {
            //checks if the user is the owner of the post
            return res.status(401).json({error: "You are not authorized to delete this post"})
        }

        //if the post has an image, delete it from cloudinary
        if(post.img) {
            //extract the image id from the url
            const imgId = post.img.split("/").pop().split(".")[0];
            //delete the image from cloudinary using the image ID
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id) //delete post from databse

        res.status(200).json({message: "Post deleted successfully"})
    } catch (error) {
        console.log("Error in deletePost controller: ", error)
        res.status(500).json({error: "Internal server error"})
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body //extract comment text from the request body
        const postId = req.params.id //extract post ID from the request parameters
        const userId = req.user._id //extract the user ID from the authenticated user

        if(!text) {
            //return an error if no text provided
            return res.status(400).json({ error: "Text is required" })
        }

        const post = await Post.findById(postId) //find the post by its ID

        if(!post) {
            //return an error if post doesn't exist
            return res.status(404).json({ error: "Post not found" })
        }

        const comment = {user: userId, text} //create new comment object w/ user ID and text

        post.comments.push(comment) //add the comment to the post's comments array

        await post.save() //save the updated post to the database

        res.status(200).json(post)
    } catch (error) {
        console.log("Error in commentOnPost controller: ", error)
        res.status(500).json({ error: "internal server error" })
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id //extract the user ID from the authenticated user
        const {id:postId} = req.params //extract the post ID from the request parameters

        const post = await Post.findById(postId) //find the post by its ID

        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }

        //checks if the user has alredy liked the post
        const userLikedPost = post.likes.includes(userId)

        if(userLikedPost) {
            //unlike post
            //remove the user's ID from the post's likes array
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}})
            //remove the post ID from teh user's likePosts array
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}})

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())
            res.status(200).json(updatedLikes)
        } else {
            //like post
            //add the user's ID to the post's likes array
            post.likes.push(userId)
            //add the post ID to the user's likedPosts array
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}})
            //save the updated post to the database
            await post.save()

            //create a notification for the post owner
            const notification = new Notfiication({
                from: userId, //the uswer who liked the post
                to: post.user, //the post owner
                type:"like" //notification type
            })
            await notification.save() //save notificaiton to the database

            const updatedLikes = post.likes
            res.status(200).json(updatedLikes)

        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        //fetch all posts from the database, newest first
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            //populate the user field with all details but exclude password
            path: "user",
            select: "-password"
        })

        //populate the comments.user field to include commenter details but no password
        .populate({
            path: "comments.user",
            select: "-password"
        })

        //if no posts are found, return an empty array
        if(posts.length === 0) {
            return res.status(200).json([])
        }

        //return list of posts
        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getLikedPosts = async (req, res) => {
    //extract the user ID from the request parameters  
    const userId = req.params.id

    try {
        const user = await User.findById(userId) //find user by their ID

        if(!user) {
            //return an error if user doesn't exist
            return res.status(404).json({error: "User not found"})
        }

        //fetch all posts that the user has liked
        const likedPosts = await Post.find(
            {_id: {$in: user.likedPosts}, //find posts that the user has liked (stored in likedPosts)
            likes: { $in: [userId] //ensure that the user ID is included in the likes array of the post
        }})
        

        .populate({
            //populate the user field to include user details, excluding password
            path: "user",
            select: "-password"
        }).populate({
            //populate the comments.user field to include commenter details, excluding password
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(likedPosts) //return list of liked posts
    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id //extract the user ID from the authenticated user
        const user = await User.findById(userId) //find the user by their ID

        if(!user) {
            //return an error if the user doesn't exist
            return res.status(404).json({ error: "User not found" })
        }

        const following = user.following //get the list of users the current user is following

        //fetch posts from users that the current user is following, sorted by creation date (newest first)
        const feedPosts = await Post.find({ user: { $in: following } })
        .sort({ createdAt: -1 })
        .populate({ //populate the user field to include user details, excluding password
            path: "user",
            select: "password"
        })
        .populate({ //populate the comments.user field to include commenter details, excluding password
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(feedPosts) //return the list of posts from followed users
    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params //extract the username from the request parameters

        const user = await User.findOne({ username }) //find the user by their username

        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }

        //fetch all posts by the user, sorted by newest first
        const posts = await Post.find( {user: user._id }).sort({ createdAt: -1 }).populate({
            //populate the user field to include user details, excluding password
            path: "user",
            select: "-password"
        }).populate({ //populate the comments.user field to include commenter details, excluding password
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(posts) //return list of posts by the user
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error)
        res.status(500).json({ error: "internal server error" })
    }
}