import express from 'express' //import express for routing
import { protectRoute } from '../middleware/protectRoute.js' //import protectRoute middleware
import { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } from '../controllers/user.controller.js' //import user controller functions

const router = express.Router() //create an express router

//route to fetch a user's profile by their username
//:username is a dynamic paramter representing the user's username
router.get("/profile/:username", protectRoute, getUserProfile)

//route to fetch suggested users to follow
router.get("/suggested", protectRoute, getSuggestedUsers)

//route to follow/unfollow a user
//:id is a dynamic parameter representing the ID of the user to follow/unfollow
router.post("/follow/:id", protectRoute, followUnfollowUser)

//route to update the user's profile
router.post("/update", protectRoute, updateUser)

export default router