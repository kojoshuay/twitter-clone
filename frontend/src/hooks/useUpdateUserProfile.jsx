//import hooks from React Query and toast notification library
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

//custom hook for updating user's profile
const useUpdateUserProfile = () => {

	//initalize the queryClient for cache management
	const queryClient = useQueryClient();

	//define the mutation hook to handle the profile update action
	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		//function that is called when the mutation is triggered
		mutationFn: async (formData) => {
			try {
				//perform the API call to update the user's profile
				const res = await fetch(`/api/users/update`, {
					method: "POST", //use POST method to update the profile
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData), //send the form data as JSON
				});
				const data = await res.json(); //parse the response body as JSON

				//check if response was successful, otherwise throw an error
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				
				//return the data received from the server
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		//called after mutation was succesful
		onSuccess: () => {
			toast.success("Profile updated successfully");

			//invalidate the authUser and userProfile queries to refresh the data
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
			]);
		},
		//called if there is an error during the mutation
		onError: (error) => {
			toast.error(error.message);
		},
	});

	//return the updateProfile function and isUpdatingProfile state to components that use the hook
	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;