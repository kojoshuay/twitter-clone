/////////////////////
//This component renders the notifications page
// displaying a list of notifications (e.g., likes, follows)
//Uses LoadingSpinner to show a loading state while notifications are being fetched
//Displays a dropdown menu for deleting all notifications
/////////////////////

import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	//access the query client to interact with React Query's cache
	const queryClient = useQueryClient()

	//fetch notifications using React Query
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"], //Query key for caching
		queryFn: async () => {
			try {
				//fetch notifications from the API
				const res = await fetch("/api/notifications")
				const data = await res.json()

				//if the response is not OK, throw an error
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}

				return data //return the notifications data
			} catch (error) {
				throw new Error(error)
			}
		}
	})

	//define a mutation for deleting all notifications
	const { mutate: deleteNotifications } = useMutation({
		//function to perform the delete notifications API call
		mutationFn: async () => {
			try {
				//send a DELETE request to the notifications endpoint
				const res = await fetch("/api/notifications", {
					method: "DELETE"
				})

				//parse the response as JSON
				const data = await res.json()

				//if the response is not OK, throw an error
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}

				return data //return the response data
			} catch (error) {
				throw new Error(error)
			}
		},
		//on successful deletion, show a success toast and refresh notifications
		onSuccess: () => {
			toast.success("Notifications deleted successfully")
			queryClient.invalidateQueries({ queryKey: ["notifications"] })
		},
		//on error, show a error toast
		onError: () => {
			toast.error(error.message)
		}
	})

	//render the notification page
	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				{/* Header with settings dropdown */}
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p> {/* Page title */}
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a> {/* Delete all notifications option */}
							</li>
						</ul>
					</div>
				</div>

				{/* Loading spinner while fetching notifications */}
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}

				{/* Display message if no notifications are found */}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}

				{/* List of notifications */}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							{/* Link to the user's profile */}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} /> {/* User avatar */}
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "} {/* Username */}
									{notification.type === "follow" ? "followed you" : "liked your post"} {/* Notification text */}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;