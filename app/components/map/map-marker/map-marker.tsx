import { EventData } from '@/app/interfaces/event-data.interface';
import { MdLocationOn } from 'react-icons/md';
import { Marker } from 'react-map-gl';

interface MapMarkerProps {
	eventData: EventData;
	onClick: any;
}

const MapMarker = ({ eventData, onClick }: MapMarkerProps) => {
	const getEventTypeColor = (color: string | undefined): string => {
		if (!color) {
			return '#60A5FA';
		}
		if (color === '11') {
			return '#F87171';
		}
		if (color === '1') {
			return '#818CF8';
		}

		return '#60A5FA';
	};

	return (
		<Marker
			anchor="bottom"
			longitude={eventData.coordinates?.long}
			latitude={eventData.coordinates?.lat}
			onClick={(event: any) => onClick(event, eventData)}
		>
			<MdLocationOn
				size={32}
				style={{
					color: getEventTypeColor(eventData.colorId),
					textShadow: '0px 0px 2px #000'
				}}
			/>
		</Marker>
	);
};

export default MapMarker;
