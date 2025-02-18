///////////////////////
//this component renders the user's profile page
//includes the profile header, posts, and likes
//Uses ProfileHeaderSkeleton to show a loading state while profile data is being fetched
//Uses Posts to display the user's posts or liked posts
//Allows users to upload a new cover image or profile picture
//////////////////////

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/common/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModel";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { formatMemberSinceDate } from "../../utils/date";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow"
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";


const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null); //cover image state
	const [profileImg, setProfileImg] = useState(null); //profile image state
	const [feedType, setFeedType] = useState("posts"); //feed type state (posts or likes)

	//refs for file inputs
	const coverImgRef = useRef(null);	
	const profileImgRef = useRef(null);

	const { username } = useParams(); //get the username from the URL params

	const { follow, isPending } = useFollow(); //useFollow hook to handle follow/unfollow 
	const { data: authUser } = useQuery({ queryKey: ["authUser"] }); //fetch authenticated user

	//fetch the user profile data
	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				//fetch the user profile from the API
				const res = await fetch(`/api/users/profile/${username}`); 
				const data = await res.json();

				//if the response is not OK, throw an error
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data; //return the user profile data
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	//useUpdateUserProfile hook for profile updates
	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

	const isMyProfile = authUser._id === user?._id; //check if the profile belongs to the authenticated user
	const memberSinceDate = formatMemberSinceDate(user?.createdAt); //format the member since date
	const amIFollowing = authUser?.following.includes(user?._id); //check if the authenticated user is following this profile

	//handle image file selection
	const handleImgChange = (e, state) => {
		const file = e.target.files[0]; //get the selected file
		if (file) {
			const reader = new FileReader(); //create a FileReader to read the file
			reader.onload = () => {
				//set the cover/profile image state based on the input
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file); //read the file as a data URL
		}
	};

	//refetch the user profile when the username changes
	useEffect(() => {
		refetch();
	}, [username, refetch]);

	//render the profile page
	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{(isLoading || isRefetching) && <ProfileHeaderSkeleton />} {/* Show skeleton while loading */}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>} {/* Show error if user not found */}
				
				{/* Profile content */}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							{/* Back button and user info */}
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p> {/* User's full name */}
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span> {/* Number of posts */}
								</div>
							</div>
							{/* Cover Image */}
							<div className='relative group/cover'>
								<img
									src={coverImg || user?.coverImg || "/cover.png"} //display the cover image
									className='h-52 w-full object-cover'
									alt='cover image'
								/>

								{/* Edit cover image button (only visible to the profile owner) */}
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()} // Trigger the file input
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								{/* Hidden file inputs for cover and profile images */}
								<input
									type='file'
									hidden
									accept='image/*'
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")} //handle cover image change
								/>
								<input
									type='file'
									hidden
									accept='image/*'
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")} //handle profile image change
								/>
								{/* User avatar */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} /> {/* Display the profile image */}

										{/* Edit profile image button (only visible to the profile owner) */}
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()} //trigger the file input
												/>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Follow/Edit profile buttons */}
							<div className='flex justify-end px-4 mt-5'>

								{/* Edit profile modal (only visible to the profile owner) */}
								{isMyProfile && <EditProfileModal authUser={authUser} />}

								{/* Follow/Unfollow button (only visible to other users) */}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => follow(user?._id)} //trigger follow/unfollow
									>
										{isPending && "Loading..."} {/* Show loading state if pending */}
										{!isPending && amIFollowing && "Unfollow"} {/* Show "Unfollow" if already following */}
										{!isPending && !amIFollowing && "Follow"}  {/* Show "Follow" if not following */}
									</button>
								)}

								{/* Update profile button (only visible if cover or profile image is changed) */}
								{(coverImg || profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={async () => {
											await updateProfile({ coverImg, profileImg }); //update the profile
											setProfileImg(null); //clear the profile image state
											setCoverImg(null);  //clear the cover image state
										}}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>
							
							{/* User info (name, username, bio) */}
							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span> {/* Full name */}
									<span className='text-sm text-slate-500'>@{user?.username}</span> {/* Username */}
									<span className='text-sm my-1'>{user?.bio}</span> {/* Bio */}
								</div>

								<div className='flex gap-2 flex-wrap'>
									{/* Display link if available */}
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>

													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{memberSinceDate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>

							{/* Posts/Likes Section */}
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					 {/* Posts Component */}
					<Posts feedType={feedType} username={username} userId={user?._id} />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;