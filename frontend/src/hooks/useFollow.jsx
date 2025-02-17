//import hooks from React Query and toast notification library
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

//hook 'useFollow' is defined for following a user
const useFollow = () => {
    //initialize the queryClient to interact with React Query cache and queries
    const queryClient = useQueryClient();

    //define the mutation hook to handle the follow action
    const {mutate:follow, isPending } = useMutation({
        //mutationFn is the function that will be called when the mutation is triggered
        mutationFn: async (userId) => {
            try {
                //perform the API call to follow a user
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST"
                })

                //parse the response body as JSON
                const data = await res.json()

                //check if the response was successful, otherwise throw an error
                if(!res.ok) {
                    throw new Error(data.error || "Something went wrong")
                }

                return data //return the data received from the server
            } catch (error) {
                //in case of an error, throw it to be handled in the onError function
                throw new Error(error.message)
            }
        },
        //onSuccess is called after the mutation is successful
        onSuccess: () => {
            //invalidate the `suggestedUsers` and `authUser` queries to refresh the data
            Promise.all([
                queryClient.invalidateQueries({queryKey: [`suggestedUsers`]}),
                queryClient.invalidateQueries({queryKey: [`authUser`]})
            ])
        },
        //onError is called if an error occurs during the mutation
        onError: (error) => {
            //show a toast notification with the error message
            toast.error(error.message)
        }
    })
    //return the follow function and isPending state to the components that use this hook
    return { follow, isPending }
}

export default useFollow