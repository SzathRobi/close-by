import { ContactLocation } from './contact-location.interface';

export interface Contact {
	email: string;
	id: string;
	name?: string;
	phoneNumber?: string;
	location?: ContactLocation;
}
