//////////////////
//This component provides a loading spinner used to indicate a loading state
//Used in NotificationPage.jsx to display a loading state when notifications are being fetched
/////////////////

const LoadingSpinner = ({ size = "md" }) => {

	//define a class based on the size proop, defaulting to medium
	const sizeClass = `loading-${size}`;

	//return a span element with the appropriate classes for the loading spinner
	return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;