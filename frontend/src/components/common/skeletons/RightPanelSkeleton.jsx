////////////////
//This component provides a loading skeleton for the right panel
//displays the structure of a user card while data is being fetched
//Used in RightPanel.jsx to display a loading state when sugguested users to follow is being fetched
///////////////


const RightPanelSkeleton = () => {
	return (
		//main container for the skeleton user card
		<div className='flex flex-col gap-2 w-52 my-2'>

			{/*container for the user avatar and user info */}
			<div className='flex gap-2 items-center'>

				{/*skeleton for the user avatar (circular placeholder) */}
				<div className='skeleton w-8 h-8 rounded-full shrink-0'></div>

				{/*container for the user name and follow button */}
				<div className='flex flex-1 justify-between'>
					<div className='flex flex-col gap-1'>
						<div className='skeleton h-2 w-12 rounded-full'></div>
						<div className='skeleton h-2 w-16 rounded-full'></div>
					</div>
					<div className='skeleton h-6 w-14 rounded-full'></div>
				</div>
			</div>
		</div>
	);
};
export default RightPanelSkeleton;