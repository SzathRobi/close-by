import { EventData } from '../interfaces/event-data.interface';
import { mapCalendarEventAttendantToEventCardAttendant } from '../mappers/calendar-event-attendant-to-event-card-attendant.mapper';
import { mapCoordinates } from '../mappers/calendar-event-response-to-event-card-mapper';

const BASE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars';

export const getEventCoordinates: any = async (events: any[]) => {
	let tempTest = [];
	for (let i = 0; i < events.length; i++) {
		const element = events[i];

		const response = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${element.location}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
		);
		const data = await response.json();

		tempTest.push({
			location: element.location,
			long: data.features[0].center[0],
			lat: data.features[0].center[1]
		});
	}

	return tempTest;
};

export const getEvents = async (
	token: string,
	email: string
): Promise<EventData[]> => {
	const date = new Date();

	const currentYear = date.getFullYear();
	const currentMonth = `0${date.getMonth() + 1}`;
	const previousThirdMonth = `0${date.getMonth() - 2}`;
	const currentDay = date.getDate();

	const res = await fetch(
		`${BASE_CALENDAR_URL}/${email}/events?` +
			new URLSearchParams({
				maxResults: '200',
				timeMin: `${currentYear}-${previousThirdMonth}-${currentDay}T10:00:00-07:00`,
				timeMax: `${currentYear}-${currentMonth}-${
					currentDay + 3
				}T10:00:00-07:00`,
				showDeleted: 'false',
				singleEvents: 'true',
				orderBy: 'startTime'
			}),
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);

	const eventsData = await res.json();
	const events = (await eventsData?.items?.reverse()) ?? [];
	const eventCoordinates = await getEventCoordinates(events);

	const mappedEvents = await events.map((event: any, index: number) => {
		return {
			attendees: event.attendees
				? event.attendees.map((attendant: any) =>
						mapCalendarEventAttendantToEventCardAttendant(attendant)
				  )
				: [],
			description: event.description,
			end: event.end,
			id: event.id,
			start: event.start,
			summary: event.summary,
			location: event.location,
			coordinates: mapCoordinates(eventCoordinates[index]),
			colorId: event?.colorId,
			calendarEventId: event.id
		};
	});

	return await mappedEvents;
};

export const postEvent = async (
	token: string,
	email: string,
	newEvent: EventData | any
) => {
	const response = await fetch(`${BASE_CALENDAR_URL}/${email}/events`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(newEvent)
	});

	const result = await response.json();

	return result;
};

export const updateEvent = async (
	token: string,
	email: string,
	newEvent: EventData | any,
	eventId: string
) => {
	const response = await fetch(
		`${BASE_CALENDAR_URL}/${email}/events/${eventId}`,
		{
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...newEvent, id: eventId })
		}
	);

	const result = await response.json();
	return result;
};

export const deleteEvent = async (
	token: string,
	email: string,
	eventId: string
) => {
	const response = await fetch(
		`${BASE_CALENDAR_URL}/${email}/events/${eventId}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: null
		}
	);

	return response;
};
