import { Contact } from '@/app/interfaces/contact.interface';
import { EventData } from '@/app/interfaces/event-data.interface';
import { FaUser } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Marker } from 'react-map-gl';

interface ContactMapMarkerProps {
	contact: Contact;
	onClick: any;
}

const ContactMapMarker = ({ contact, onClick }: ContactMapMarkerProps) => {
	return (
		<Marker
			anchor="bottom"
			longitude={Number(contact.location?.coordinates?.longitude)}
			latitude={Number(contact.location?.coordinates?.latitude)}
		>
			<FaUser
				size={24}
				style={{
					color: '#ff00ff',
					textShadow: '0px 0px 2px #000'
				}}
			/>
		</Marker>
	);
};

export default ContactMapMarker;
