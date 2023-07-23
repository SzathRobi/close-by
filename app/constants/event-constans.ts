import { EventType } from '../interfaces/event-type.interface';

export const eventTypes: EventType[] = [
	{
		type: 'Esemény',
		color: 'blue'
	},
	{
		type: 'Hívandó',
		color: 'red'
	},
	{
		type: 'Kérdőív',
		color: 'gray'
	}
];

export const phoneNumberRegex =
	/(\+36|06)\s?-?\s?\d{2,3}\s?-?\s?\d{3}\s?-?\s?\d{3,4}/g;
