///////////////////////////
//This is the main application component that sets up routing
//renders the sidebar and right panel
//Uses react-router-dom's Routes and Route to define the application's routes
//Renders Sidebar and RightPanel as common components across all pages
//Routes to HomePage, SignUpPage, LoginPage, NotificationPage, and ProfilePage
//////////////////////////////

import { Route, Routes, Navigate } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";


function App() {
	const {data:authUser, isLoading} = useQuery({
		//the key "authUser" uniquely identifies this query
		//it's used to cache and invalidate the query data
		queryKey: ['authUser'],

		//function to fetch user authentication data
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me"); //fetches current user data from the backend
				const data = await res.json(); //convert response to JSON

				if(data.error) {
					return null; //if error in response, return null
				}

				if(!res.ok) {
					throw new Error(data.error || "Something went wrong") //error if request fails
				}

				console.log("authUser is here:", data)
				return data; //returns authenticated user data

			} catch (error) {
				throw new Error(error)
			}
		},
		retry: false //prevents automatic refecthing when the window is refocused
	})

	//if data is loading, display a spinner
	if(isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		)
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
      {/*common component because it's not wrapped with Routes*/}
      {authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        		<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
        		<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
      {authUser && <RightPanel />}
	  <Toaster />
		</div>
	);
}

export default App
