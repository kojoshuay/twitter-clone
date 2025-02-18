//function to format the post's creation date relative to the current state
export const formatPostDate = (createdAt) => {
	const currentDate = new Date(); //get the current date and time
	const createdAtDate = new Date(createdAt); //convert the provided timestamp into a Date object

	const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000); //calculate the time difference in seconds

	//convert the difference into minutes, hours, and days
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60); 
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	//if the post is more than a day old, display the date
	if (timeDifferenceInDays > 1) {
		return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	} else if (timeDifferenceInDays === 1) { 
		return "1d"; //if the post was created exactly 1 day ago, return "1d"
	} else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours}h`; //if the post was created within the last 24 hours, return the hours elapsed (e.g., "5h")
	} else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes}m`; //if the post was created within the last 60 minutes, return the minutes elapsed (e.g., "30m")
	} else {
		return "Just now"; //If the post was just created, return "Just now"
	}
};

//function to format the "Member Since" date for a user profile
export const formatMemberSinceDate = (createdAt) => {

	//convert the provided timestamp into a Date object
	const date = new Date(createdAt);

	//array of month names to convert numeric months into readable format
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const month = months[date.getMonth()]; //get the month name from the months array based on the Date object
	const year = date.getFullYear(); //get the year from the Date object
	return `Joined ${month} ${year}`; //return the formatted string, e.g., "Joined January 2023"
};