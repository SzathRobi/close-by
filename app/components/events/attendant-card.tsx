import { Attendant } from '@/app/interfaces/attendant.interface';
import React from 'react';

interface AttendantProps {
	attendant: Attendant;
}

const AttendantCard = ({ attendant }: AttendantProps) => {
	const statusColor = () => {
		if (attendant.status === 'elutasította') return 'text-red-700';
		if (attendant.status === 'nem válaszolt') return 'text-yellow-700';
		return 'text-green-700';
	};
	return (
		<article className="mb-4 rounded-lg p-2 shadow-md shadow-neutral-500">
			<p>{attendant.email}</p>
			<p className={statusColor()}>{attendant.status}</p>
		</article>
	);
};

export default AttendantCard;
