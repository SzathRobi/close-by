import { Attendant } from './attendant.interface';

export interface EventData {
	attendants?: Attendant[];
	description: string;
	endDate: string;
	endTime: string;
	id?: string;
	startDate: string;
	startTime: string;
	title: string;
}
