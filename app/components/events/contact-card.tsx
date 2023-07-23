import React from 'react';
import { BsPencil } from 'react-icons/bs';
import { FaMapMarkedAlt, FaUser } from 'react-icons/fa';
import { EventData } from '@/app/interfaces/event-data.interface';

import Button from '../shared/button/button';
import { Contact } from '@/app/interfaces/contact.interface';

interface ContactCardProps {
	contact: Contact;
	onMarkerOpen: any;
	searchValue: string;
}

const ContactCard = ({
	contact,
	onMarkerOpen,
	searchValue
}: ContactCardProps) => {
	const getHighlightedText = (text: string = '') => {
		// Split text on higlight term, include term itself into parts, ignore case
		let parts = text.split(new RegExp(`(${searchValue})`, 'gi'));
		return parts.map((part, index) => (
			<React.Fragment key={index}>
				{part.toLowerCase() === searchValue.toLowerCase() ? (
					<b className="rounded bg-orange-400 bg-opacity-50">
						{part}
					</b>
				) : (
					part
				)}
			</React.Fragment>
		));
	};

	return (
		<article className="relative mt-4 flex w-full flex-col rounded-lg bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.4)] transition duration-200">
			<div className="absolute top-4 right-4">
				<FaUser size={12} />
			</div>
			<p className="mb-2 text-sm text-gray-600">
				{getHighlightedText(
					contact?.location?.locationName || 'nincs megadva lakcím'
				)}
			</p>
			<div className="mb-4">
				<h4 className="mb-2 text-xl font-medium">
					{getHighlightedText(contact.email)}
				</h4>
				<p>{getHighlightedText(contact?.name)}</p>
			</div>

			<div className="items center mb-4 flex justify-start gap-4">
				<p>{contact.phoneNumber}</p>
			</div>

			<div>
				{contact.location?.coordinates ? (
					<button
						type="button"
						className="rounded-full border border-emerald-700 p-3 transition-colors hover:bg-emerald-50"
						onClick={(event) =>
							contact.location?.coordinates
								? onMarkerOpen(event, undefined, true, contact)
								: null
						}
					>
						<FaMapMarkedAlt size={20} color="#047857" />
					</button>
				) : null}
			</div>
		</article>
	);
};

export default ContactCard;
