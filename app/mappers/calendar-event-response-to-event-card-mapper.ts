import { EventData } from '../interfaces/event-data.interface';
import { mapCalendarEventAttendantToEventCardAttendant } from './calendar-event-attendant-to-event-card-attendant.mapper';

export const mapCalendarEventResponseToEventData = (
	calendarEvent: any
): EventData => ({
	attendants: calendarEvent.attendees
		? calendarEvent.attendees.map((attendant: any) =>
				mapCalendarEventAttendantToEventCardAttendant(attendant)
		  )
		: [],
	description: calendarEvent.description,
	endDate: calendarEvent.end.dateTime.split('T')[0].replace('-', '.'),
	endTime: calendarEvent.end.dateTime.split('T')[1].slice(0, 6),
	id: calendarEvent.id,
	startDate: calendarEvent.start.dateTime.split('T')[0].replace('-', '.'),
	startTime: calendarEvent.start.dateTime.split('T')[1].slice(0, 6),
	title: calendarEvent.summary
});
