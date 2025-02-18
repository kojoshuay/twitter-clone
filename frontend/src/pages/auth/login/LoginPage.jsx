/////////////////////
//This component renders the login page
//allows users to enter their credentials and log in
//Uses react-router-dom's Link to navigate to the signup page
//Handles form submission and input changes for login credentials
//Displays an error message if login fails
/////////////////////

import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast"

const LoginPage = () => {
	//state to manage form data
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	//access the query client for cache management
	const queryClient = useQueryClient();

	//define a mutation for logging in
	const {mutate:logInMutation, isPending, isError, error} = useMutation({
		//function to perform the login API call
		mutationFn: async ({username, password}) => {
			try {
				//send a POST request to the login endpoint
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					//send username and password in request body
					body: JSON.stringify({ username, password })
				})

				//pare the response as JSOn
				const data = await res.json();

				//if the response is not OK, throw an error
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		//when login is successful, invalidate 'authUser' so it refetches updated data
		onSuccess: () => {
			//react Query caches the last known state
			//if no refresh, the UI might still think the user is logged out even after login
			//triggers the queryFn from useQuery, making a new API request (/api/auth/me)
			//the cache updates with fresh data from the server
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		}
	})

	const handleSubmit = (e) => {
		e.preventDefault(); //prevent default form submission behavior
		logInMutation(formData); //call the mutation function when the form is submitted
	};

	//handle input changes in the form
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	//render the log in page
	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			{/* Left side (hidden on small screens) */}
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>

			{/* Right side (login form) */}
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' /> {/* Display the logo on small screens */}
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1> {/* Heading */}
					<label className='input input-bordered rounded flex items-center gap-2'>  {/* Username input */}
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					{/* Password input */}
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					{/* Login button */}
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Login"}
					</button>

					{/* Display error message if login fails */}
					{isError && <p className='text-red-500'>
						{error.message}
						</p>}
				</form>

				{/* Signup link */}
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;