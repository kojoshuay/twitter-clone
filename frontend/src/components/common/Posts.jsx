//////////////
//This component renders a list of posts/loading skeleton if the posts are being fetched
//Uses the Post component to render individual posts
//Uses the PostSkeleton component to show a loading state
//Fetches dummy data from POSTS to render posts
/////////////

import { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "./skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";

const Posts = ({feedType, username, userId}) => {
	//function to determine the API endpoint based on the feed type
	const getPostEndpoint = () => {
		switch(feedType) {
			case "forYou" :
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	}

	//stores the API endpoint
	const POST_ENDPOINT = getPostEndpoint()

	//fetch posts using React Query
	const {data:posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT)
				const data = await res.json()

				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}

				return data

			} catch (error) {
				throw new Error(error)
			}
		}
	})

	//refetch posts when the feed type, username, or userId changes
	useEffect(() => {
		refetch()
	}, [feedType, refetch, username, userId])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;