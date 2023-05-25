'use client';

import { EventData } from '@/app/interfaces/event-data.interface';
import { Popup } from 'react-map-gl';

interface MapPopupProps {
	eventData: EventData;
	onClose: any;
}

const MapPopup = ({ eventData, onClose }: MapPopupProps) => {
	if (eventData === null) {
		return null;
	} else {
		const startDate = eventData.start.dateTime.split('T')[0];
		const startTime = eventData.start.dateTime.split('T')[1].slice(0, 5);
		const endTime = eventData.end.dateTime.split('T')[1].slice(0, 5);

		const phoneNumberRegex = /\+\d{11}/gm;

		return (
			<Popup
				anchor="top"
				latitude={Number(eventData.coordinates?.lat)}
				longitude={Number(eventData.coordinates?.long)}
				onClose={onClose}
			>
				<h5 className="font-semibold">{eventData.summary}</h5>
				<p className="min-w-[160px]">{eventData.location}</p>
				<div className="items center flex justify-start gap-4">
					<p>{startDate}</p>
					<p>
						{startTime} - {endTime}
					</p>
				</div>
				<p>
					{eventData.description
						? eventData.description.match(phoneNumberRegex)
						: 'nincs telefonszám megadva'}
				</p>
			</Popup>
		);
	}
};

export default MapPopup;
