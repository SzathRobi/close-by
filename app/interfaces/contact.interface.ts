import { ContactLocation } from './contact-location.interface';

export interface Contact {
	email: string;
	name?: string;
	phoneNumber?: string;
	location?: ContactLocation;
}
