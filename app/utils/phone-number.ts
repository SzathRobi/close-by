type PhoneNumberRequestProps = {
	phoneNumber: string;
	calendarEventId: string;
};

export const postPhoneNumber = async ({
	phoneNumber,
	calendarEventId
}: PhoneNumberRequestProps) => {
	const requestData = {
		phoneNumber,
		calendarEventId
	};

	const response = await fetch('/api/phonenumber', {
		method: 'POST',
		body: JSON.stringify(requestData)
	});

	const result = await response.json();

	return result;
};

export const getPhoneNumberByCalendarEventId = async (
	calendarEventId: string
) => {
	const response = await fetch(`/api/phonenumber/${calendarEventId}`);

	const result = await response.json();

	return result;
};

export const updatePhoneNumberByCalendarEventId = async ({
	calendarEventId,
	phoneNumber
}: PhoneNumberRequestProps) => {
	const requestData = {
		phoneNumber,
		calendarEventId
	};

	const response = await fetch(`/api/phonenumber/${calendarEventId}`, {
		method: 'PUT',
		body: JSON.stringify(requestData)
	});

	const result = await response.json();

	return result;
};
