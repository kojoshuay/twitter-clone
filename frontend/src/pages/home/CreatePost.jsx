////////////////////
//This component allows users to create a new post, including text and an optional image
//Used in HomePage.jsx to provide a post creation input at the top of the feed.
//Handles image uploads and post submission.
//Displays a preview of the uploaded image
////////////////////

import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	//state to manage the post text and image
	const [text, setText] = useState(""); //text input
	const [img, setImg] = useState(null); //image file
	const imgRef = useRef(null); //reference to the file input element

	//fetch the authenticated user data
	const {data:authUser} = useQuery({queryKey: ['authUser']})

	//access the query client to interact with React Query's cache
	const queryClient = useQueryClient();

	//define a mutation for creating a post
	const {mutate:createPost, isPending, isError, error} = useMutation({
		//function to perform the post creation API call
		mutationFn: async ({ text, img }) => {
			try {
				//send a POST request to the create post endpoint
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					//send post text and image in the request body
					body: JSON.stringify({text, img})
				})

				//parse the response as JSON
				const data = await res.json();
				
				//if the response is not OK, throw an error
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}

				//return the response data
				return data
			} catch (error) {
				throw new Error(error)
			}
		},
		//on successful post creation, reset the form and show a success toast
		onSuccess: () => {
			setText("") //clear the text input
			setImg(null) //clear the image
			toast.success("Post created successfully")
			queryClient.invalidateQueries({queryKey: ['posts']}) //refresh the posts list
		}
	})

	//handle form submission
	const handleSubmit = (e) => {
		e.preventDefault(); //page won't refresh
		createPost({text, img}) //trgger the signup mutation with the form data
	};

	//handle image file selection
	const handleImgChange = (e) => {
		const file = e.target.files[0]; //get the selected file
		if (file) {
			const reader = new FileReader(); //create a FileReader to read the file
			reader.onload = () => {
				setImg(reader.result); //set the image state to the file's data
			};
			reader.readAsDataURL(file); //read the file as a data URL
		}
	};

	//render the post creation form
	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} /> {/* Display the user's profile image */}
				</div>
			</div>

			{/* Post creation form */}
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				{/* Text input */}
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)} //update the text state
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null); //clear the image
								imgRef.current.value = null; //rest the file input
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' /> {/* Display the image */}
					</div>
				)}

				{/* Image upload and post button */}
				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()} //trigger the file input
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' /> 
					</div>
					<input type='file'accept = 'image/*' hidden ref={imgRef} onChange={handleImgChange} /> {/* Hidden file input */}
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"} {/* Show loading state if pending */}
					</button>
				</div>

				{/* Display error message if post creation fails */}
				{isError && <div className='text-red-500'>
					{error.message || "Something went wrong"}
					</div>}
			</form>
		</div>
	);
};
export default CreatePost;