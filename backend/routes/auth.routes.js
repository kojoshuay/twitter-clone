import express from "express" //import express for routing
import { getMe, signup, login, logout } from "../controllers/auth.controller.js" //import auth controller functions
import { protectRoute } from "../middleware/protectRoute.js" //import protectRoute middleware

const router = express.Router() //create an express Router

router.get("/me", protectRoute, getMe) //route to get current user's profile

router.post("/signup", signup) //route to sign up a new user

router.post("/login", login) //route to log in a user

router.post("/logout", logout) //rotuer to log out a user

export default router