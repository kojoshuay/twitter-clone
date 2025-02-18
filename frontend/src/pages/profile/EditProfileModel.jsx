//////////////////////////
//This component provides a modal for users to edit their profile info (name, bio, password)
//used in ProfilePage.jsx to allow users to update their profile
//Handles form submission and input changes for profile updates
//////////////////////////

import { useState, useEffect } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";


const EditProfileModal = ({ authUser }) => {
	//state to manage the form data, initially empty
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	//destructure updateProfile function and loading state from the custom hook
	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	//handles input change and updates formData
	//uses the event target's name to determine which field to update
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	//prefills the form with authenticated user data
	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "", //keeps password field empty by default
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			{/* Button to open the modal */}
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>

			{/* Modal Dialog for Editing Profile */}
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>

					{/* Form for updating profile info */}
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault(); //prevents page refresh
							updateProfile(formData);  //calls function to update profile
						}}
					>
						{/* Full Name and Username Inputs */}
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>

						{/* Email and Bio Inputs */}
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>

						{/* Password Inputs */}
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>

						{/* Link Input */}
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>

						{/* Submit Button */}
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>

				{/* Close Modal Button */}
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;