//////////////////////
//This component renders the signup page, allowing users to create a new account
//Uses react-router-dom's Link to navigate to the login page.
//Handles form submission and input changes for user registration.
//Displays an error message if signup fails
/////////////////////////

import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from '@tanstack/react-query'
import toast from "react-hot-toast";

const SignUpPage = () => {
	//state to manage form data (email, username, fullName, password)
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	//define a mutation for signing up
	const { mutate, isError, isPending, error } = useMutation({
		//function to perform the signup API call
		mutationFn: async ({email, username, fullName, password}) => {
			try {
				//send a POST request for the signup endpoint
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					//send form data in the request body
					body: JSON.stringify({ email, username, fullName, password}),
				})
				
				//parse the response as JSON
				const data = await res.json()

				//if the response is not OK, throw an error
				if(!res.ok) {
					throw new Error(data.error || "Failed to create account")
				}
				
				console.log(data)
				return data //return the response data
			} catch (error) {
				console.error(error)
				throw error
			}
		},
		//on successful signup, show a notification
		onSuccess: () => {
			toast.success("Account created successfully")
		}
	})

	//handle form submission
	const handleSubmit = (e) => {
		e.preventDefault(); //page won't refresh
		mutate(formData) //trgger the signup mutation with the form data
	};

	//handle input changes in the form
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	//render the sign up page
	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			{/* Left side (hidden on small screens) */}
			<div className='flex-1 hidden lg:flex items-center  justify-center'> 
				<XSvg className=' lg:w-2/3 fill-white' /> {/* Display logo */}
			</div>

			{/* Right side (signup form) */}
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' /> {/* Display logo on small screens */}
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1> {/* Heading */}

					{/* Email input */}
					<label className='input input-bordered rounded flex items-center gap-2'> 
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					{/* Username and full name inputs */}
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>

						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>

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

					{/* Signup button */}
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Sign Up"}
					</button>
					{/* Display error message if signup fails */}
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>

				{/* Login link */}
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;