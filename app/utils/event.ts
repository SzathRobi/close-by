import { EventData } from '../interfaces/event-data.interface';
import { mapCalendarEventResponseToEventData } from '../mappers/calendar-event-response-to-event-card-mapper';

export const getEvents = async (
	token: string,
	email: string
): Promise<EventData[]> => {
	const res = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${email}/events?` +
			new URLSearchParams({
				maxResults: '10',
				timeMin: new Date().toISOString(),
				timeMax: '2023-03-03T10:00:00-07:00',
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

	// const events = mapCalendarEventResponseToEventData(await res.json());
	const eventsData = await res.json();
	const events = eventsData.items;
	const mappedEvents = events.map(mapCalendarEventResponseToEventData);

	return mappedEvents;

	// return events;
};

export const postEvent = async (token: string, email: string) => {
	await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${email}/events?`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);
};
