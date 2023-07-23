import { Attendant } from './attendant.interface';
import { PhoneNumberInDb } from './phone-number-in-db.interface';

export interface EventData {
	attendees: Attendant[];
	description: string;
	end: {
		dateTime: string;
		timeZone: string;
	};
	start: {
		dateTime: string;
		timeZone: string;
	};
	id?: string;
	calendarEventId: string;
	summary: string;
	colorId?: string;
	onUpdateButtonClick?: any;
	location?: string;
	coordinates?: {
		long: number;
		lat: number;
	};
	phoneNumber?: PhoneNumberInDb;
	reminders?: {
		useDefault: boolean;
	};
}
