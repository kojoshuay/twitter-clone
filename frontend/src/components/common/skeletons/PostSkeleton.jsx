////////////////////
//This component provides a loading skeleton for posts
//displays the structure of a post while data is being fetched
//Used in Posts.jsx to display a loading state when posts are being fetched.
///////////////////

const PostSkeleton = () => {
	return (
		//main container for the skeleton post
		<div className='flex flex-col gap-4 w-full p-4'>
			{/*container for the user avatar and info*/}
			<div className='flex gap-4 items-center'>
				{/*skeleton for the user avatar (circular placeholder)*/}
				<div className='skeleton w-10 h-10 rounded-full shrink-0'></div>

				{/*container for the fullName and username*/}
				<div className='flex flex-col gap-2'>

					{/*skeleton for the user's full name*/}
					<div className='skeleton h-2 w-12 rounded-full'></div>

					{/*skeleton for the username*/}
					<div className='skeleton h-2 w-24 rounded-full'></div>
				</div>
			</div>
			{/*skeleton for the post content (rectangulary placeholder) */}
			<div className='skeleton h-40 w-full'></div>
		</div>
	);
};
export default PostSkeleton;