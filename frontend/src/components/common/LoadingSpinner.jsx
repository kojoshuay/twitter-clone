//////////////////
//This component provides a loading spinner used to indicate a loading state
//Used in NotificationPage.jsx to display a loading state when notifications are being fetched
/////////////////

const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;