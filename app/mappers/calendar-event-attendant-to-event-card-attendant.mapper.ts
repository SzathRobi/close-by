import { Attendant } from '../interfaces/attendant.interface';

export const mapCalendarEventAttendantToEventCardAttendant = (
	attendant: any
): Attendant => ({
	email: attendant.email,
	status: attendant.responseStatus
});
