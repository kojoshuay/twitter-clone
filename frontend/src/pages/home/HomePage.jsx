////////////////////
//This component renders the home page, including the post creation input and the list of posts
//Uses CreatePost to allow users to create new posts
//Uses Posts to display the list of posts.
//Toggles between "For You" and "Following" feeds
///////////////////

import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	//state to manage the feed type ("forYou" or "following")
	const [feedType, setFeedType] = useState("forYou");

	//render the home page
	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header with feed type tabs*/}
				<div className='flex w-full border-b border-gray-700'>
					{/* "For You" tab */}
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")} //set feed type to "forYou"
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div> //highlight the active tab
						)}
					</div>

					{/* "Following" tab */}
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")} //set feed type to "following"
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div> //highlight the active tab
						)}
					</div>
				</div>

				{/*Post creation input */}
				<CreatePost />

				{/*List of posts */}
				<Posts feedType={feedType}/>
			</div>
		</>
	);
};
export default HomePage;