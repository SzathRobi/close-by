import { Attendant } from '../interfaces/attendant.interface';
import {
	AttendantStatus,
	AttendantStatusHun
} from '../types/attendant-status.type';

const mapCalendarEventAttendantStatustoEventCardAttendantStatus = (
	status: AttendantStatus
): AttendantStatusHun => {
	if (status === 'accepted') return 'ott lesz';
	if (status === 'declined') return 'elutasította';
	return 'nem válaszolt';
};

export const mapCalendarEventAttendantToEventCardAttendant = (
	attendant: any
): Attendant => ({
	email: attendant.email,
	status: mapCalendarEventAttendantStatustoEventCardAttendantStatus(
		attendant.responseStatus
	)
});
