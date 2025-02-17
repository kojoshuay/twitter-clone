//////////////
//This component renders a list of posts/loading skeleton if the posts are being fetched
//Uses the Post component to render individual posts
//Uses the PostSkeleton component to show a loading state
//Fetches dummy data from POSTS to render posts
/////////////

import Post from "../Post";
import PostSkeleton from "./skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";

const Posts = () => {
	const isLoading = false;

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;