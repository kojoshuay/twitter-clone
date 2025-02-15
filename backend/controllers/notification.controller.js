//import notification model
import Notfiication from "../models/notification.model.js"

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id //get user id from request

        //find notifications for the user and populate the from field
        const notifications = await Notfiication.find({ to: userId}).populate({

            //from field is a reference to the User collection
            //this field stores the ObjectId of a user who triggered the notification (the user who liked a post or followed the current user)
            //telling Mongoose to replace the ObjectId in the from field with the actual doc from the User collection
            path: "from",
            //specifies which fields from User should be included in the result
            //username and profileImg fields are the only ones included
            select: "username profileImg"
        })

        //mark all notifications as read
        await Notfiication.updateMany({to:userId}, {read:true})

        res.status(200).json(notifications) //return the notifications
    } catch (error) {
        console.log("Error in getNotifications function", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id //get user ID from the request

        await Notfiication.deleteMany({to:userId}) //delete all notifications for the user

        res.status(200).json({message: "Notifications deleted successfully"})
    } catch (error) {
        console.log("Error in deleteNotifications function", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params._id //get the notification ID from the request parameters
        const userId = req.user._id //ger the user ID from the request
        const notification = await Notification.findById(notificationId) //find the notifications by ID

        if(!notification) {
            //return error if notification not found
            return res.status(404).json({error: "Notification not found"})
        }

        if(notification.to.toString() !== userId.toString()) {
            return res.status(403).json({error: "You are not allowed to delete this notificaiton"})
        }

        await Notification.findByIdAndDelete(notificationId) //delete the notification
        res.status(200).json({message: "Notification deleted successfully"})
    } catch (error) {
        console.log("Error in deleteNotification function", error.message)
        res.status(500).json({ error: "internal server error"})
    }
}