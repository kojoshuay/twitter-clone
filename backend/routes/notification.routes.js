import express from 'express' //import express for routing
import { protectRoute } from "../middleware/protectRoute.js" //import protectRoute middleware
import { getNotifications, deleteNotifications, deleteNotification } from '../controllers/notification.controller.js' //import notification controller functions

const router = express.Router() //create an express router

router.get("/", protectRoute, getNotifications) //route to get all notfications for the user
router.delete("/", protectRoute, deleteNotifications) //route to delete all notifications for the user
router.delete("/:id", protectRoute, deleteNotification) //route to delete a specfic notification

export default router
