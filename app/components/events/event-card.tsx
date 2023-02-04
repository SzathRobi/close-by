import { BsPencil } from 'react-icons/bs';

import { EventData } from '@/app/interfaces/event-data.interface';

const EventCard = ({
	attendants,
	description,
	endDate,
	endTime,
	id,
	startDate,
	startTime,
	title
}: EventData) => {
	return (
		<article className="w-80 relative p-2 flex flex-col lg:flex-row shadow-md hover:shadow-lg rounded bg-white transition duration-200">
			<div className="mb-4">
				<h4 className="text-xl font-medium mb-2">{title}</h4>
				<p className="w-5/6">{description}</p>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-1 mb-4">
				<p>{startDate}</p>
				<p>
					{startTime} - {endTime}
				</p>
				<p>{attendants?.length ?? 0} résztvevő</p>
			</div>

			<button className="flex items-center justify-center gap-2 rounded bg-teal-600 text-white py-1">
				<span className="lg:hidden">Módosítás</span>
				<BsPencil />
			</button>
		</article>
	);
};

export default EventCard;
