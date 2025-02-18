//////////////////////
//This component provides a loading skeleton for the profile header
//displays the structure of a profile while data is being fetched
//Used in ProfilePage.jsx to display a loading state when profile data is being fetched
/////////////////////


const ProfileHeaderSkeleton = () => {
	return (
		//main container for the skeleton profile header
		<div className='flex flex-col gap-2 w-full my-2 p-4'>
			{/*container for the profile header content*/}
			<div className='flex gap-2 items-center'>
				{/*container for the profile details */}
				<div className='flex flex-1 gap-1'>
					{/* Container for the profile text and image */}
					<div className='flex flex-col gap-1 w-full'>
						<div className='skeleton h-4 w-12 rounded-full'></div>
						<div className='skeleton h-4 w-16 rounded-full'></div>
						<div className='skeleton h-40 w-full relative'>
							<div className='skeleton h-20 w-20 rounded-full border absolute -bottom-10 left-3'></div>
						</div>
						<div className='skeleton h-6 mt-4 w-24 ml-auto rounded-full'></div>
						<div className='skeleton h-4 w-14 rounded-full mt-4'></div>
						<div className='skeleton h-4 w-20 rounded-full'></div>
						<div className='skeleton h-4 w-2/3 rounded-full'></div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProfileHeaderSkeleton;