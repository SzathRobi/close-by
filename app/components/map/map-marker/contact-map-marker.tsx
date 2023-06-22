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
			onClick={(event: any) =>
				onClick(event, undefined, undefined, contact)
			}
		>
			<div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
				<FaUser
					size={16}
					style={{
						color: '#38BDF8',
						textShadow: '0px 0px 2px #000'
					}}
				/>
			</div>
		</Marker>
	);
};

export default ContactMapMarker;
