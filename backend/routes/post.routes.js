import express from 'express' //import express for routing
import { protectRoute } from '../middleware/protectRoute.js' //import protectRoute middleware
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/post.controller.js' //import post controller functions

const router = express.Router() //create express router

router.get("/all", protectRoute, getAllPosts) //route to fetch all posts

//route to fetch all posts from users the current user is following
router.get("/following", protectRoute, getFollowingPosts)

//route to fetch posts liked by a specfic user
//:id is a dynamic parameter representing the user's ID
router.get("/likes/:id", protectRoute, getLikedPosts)

//route to fetch posts by a specfic user
//:username is a dynamic parameter representing the user's username
router.get("/user/:username", protectRoute, getUserPosts)

//route to crate a new post
router.post("/create", protectRoute, createPost)

//route to like/unlike a post 
//:id is a dynamic parameter representing the post's ID
router.post("/like/:id", protectRoute, likeUnlikePost)

//route to add a comment to a post
//:id is a dynamic parameter representing the post's ID
router.post("/comment/:id", protectRoute, commentOnPost)

//route to delete a post
//:id is a dynamic parameter representing the post's ID
router.delete("/:id", protectRoute, deletePost)

export default router