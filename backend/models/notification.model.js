import mongoose from 'mongoose'; //import mongoose for schema creation

//define the notification schema
const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['follow', 'like'] //only allow follow or like as notification types
    },
    read: {
        type: Boolean,
        default: false //default to unread
    }
}, {timestamps: true}) //add timestamps for createdAt and updatedAt

//create the Notification model
const Notfiication = mongoose.model('Notification', notificationSchema)

export default Notfiication