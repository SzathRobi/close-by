'use client';

import { ContactLocation } from '@/app/interfaces/contact-location.interface';
import { Contact } from '@/app/interfaces/contact.interface';
import { useState } from 'react';
import { FaCheck, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import InlineLoader from '../../loaders/inline/inline-loader';
import Button from '../../shared/button/button';
import Input from '../../shared/input/input';

interface ContactCardProps {
	contact: Contact;
	index: number;
	updateContactName: any;
	updateContactEmail: any;
	updateContactLocation: any;
	updateContactPhoneNumber: any;
	deleteContactByIndex: any;
	updateContactByIndex: any;
}

const ContactCard = ({
	contact,
	index,
	updateContactName,
	updateContactPhoneNumber,
	updateContactEmail,
	updateContactLocation,
	deleteContactByIndex,
	updateContactByIndex
}: ContactCardProps) => {
	const [originalId] = useState<string>(contact?.id ?? '');
	const [originalName] = useState<string>(contact?.name ?? '');
	const [originalEmail] = useState<string>(contact.email);
	const [originalPhoneNumber] = useState<string>(contact?.phoneNumber ?? '');
	const [originalLocation] = useState<ContactLocation | undefined>(
		contact?.location ?? undefined
	);

	const [modifyButtonIcon, setModifyButtonIcon] = useState(<FaPencilAlt />);
	const [deleteButtonIcon, setDeleteButtonIcon] = useState(<FaTrash />);

	const onModifyButtonClick = () => {
		setModifyButtonIcon(<InlineLoader size={16} />);

		updateContactByIndex(
			contact,
			{
				name: originalName,
				email: originalEmail,
				phoneNumber: originalPhoneNumber,
				location: originalLocation,
				id: originalId
			},
			index
		).then((data: any) => {
			setTimeout(() => {
				setModifyButtonIcon(<FaPencilAlt />);
			}, 1000);

			if (data.success) {
				setModifyButtonIcon(<FaCheck />);
			} else {
				setModifyButtonIcon(<MdClose />);
			}
		});
	};

	const onDeleteButtonClick = () => {
		setDeleteButtonIcon(<InlineLoader size={16} />);

		deleteContactByIndex(contact, index).then((data: any) => {
			setTimeout(() => {
				setDeleteButtonIcon(<FaTrash />);
			}, 1000);

			setDeleteButtonIcon(<FaCheck />);
		});
	};

	return (
		<div className="mb-4 rounded border-b-2 border-black border-opacity-30 bg-gray-50 p-2 pb-4 shadow-md shadow-stone-400">
			<div className="mb-2">
				<h4>Név</h4>
				<Input
					placeholder="Nincs megadva"
					name={`contact-name-${index}`}
					value={contact.name}
					onChange={(event: any) => updateContactName(event, index)}
				/>
			</div>
			<div className="mb-4">
				<h4>Email</h4>
				<Input
					name={`contact-email-${index}`}
					value={contact.email}
					onChange={(event: any) => updateContactEmail(event, index)}
				/>
			</div>
			<div className="mb-4">
				<h4>Telefonszám</h4>
				<Input
					placeholder="Nincs megadva"
					name={`contact-phoneNumber-${index}`}
					value={contact.phoneNumber}
					onChange={(event: any) =>
						updateContactPhoneNumber(event, index)
					}
				/>
			</div>
			<div className="mb-4">
				<h4>Helyszín</h4>
				<Input
					placeholder="Nincs megadva"
					name={`contact-location-${index}`}
					value={contact.location?.locationName}
					onChange={(event: any) =>
						updateContactLocation(event, index)
					}
				/>
			</div>

			<div className="flex items-center justify-start gap-4">
				<Button
					error
					text="Törlés"
					type="button"
					size="sm"
					icon={deleteButtonIcon}
					onClick={() => onDeleteButtonClick()}
				/>
				<Button
					secondary
					text="Módosítás"
					type="button"
					size="sm"
					icon={modifyButtonIcon}
					onClick={() => onModifyButtonClick()}
				/>
			</div>
		</div>
	);
};

export default ContactCard;
