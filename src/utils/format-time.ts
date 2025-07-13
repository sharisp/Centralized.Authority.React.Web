export const removeMilliseconds = (time: string): string => {
	const parts = time.split(".");
	return parts[0]; // "hh:mm:ss"
};
