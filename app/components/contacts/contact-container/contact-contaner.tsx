'use client';

import { Contact } from '@/app/interfaces/contact.interface';
import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp, FaUser } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Button from '../../shared/button/button';
import AddContactForm from '../add-contact-form/add-contact-form';
import ContactCard from '../contact-card/contact-card';

interface ContactContanerProps {
	contacts: Contact[];
	addContact: any;
	updateContactName: any;
	updateContactPhoneNumber: any;
	updateContactEmail: any;
	updateContactLocation: any;
	closeContactModal: any;
	deleteContactByIndex: any;
	updateContactByIndex: any;
}

const ContactContaner = ({
	addContact,
	contacts,
	closeContactModal,
	deleteContactByIndex,
	updateContactByIndex,
	updateContactEmail,
	updateContactLocation,
	updateContactName,
	updateContactPhoneNumber
}: ContactContanerProps) => {
	const [isAddContactModalVisible, setIsAddContactModalVisible] =
		useState<boolean>(false);

	return (
		<div>
			<div className="mb-4 flex items-center justify-end">
				<button
					type="button"
					className="text-gray-500 transition-colors hover:text-gray-700"
					onClick={() => closeContactModal()}
				>
					<MdClose size={24} />
				</button>
			</div>
			<h3 className="mb-4 text-lg">Kontaktok</h3>
			<div className="mb-8 flex justify-between">
				<Button
					text="Kontakt hozzáadása"
					type="button"
					size="sm"
					icon={
						isAddContactModalVisible ? (
							<FaArrowUp />
						) : (
							<FaArrowDown />
						)
					}
					onClick={() =>
						setIsAddContactModalVisible(!isAddContactModalVisible)
					}
				/>
				<p>{contacts.length} kontakt</p>
			</div>

			{isAddContactModalVisible ? (
				<AddContactForm addContact={addContact} />
			) : null}

			<div className="flex flex-col">
				{contacts.length > 0 ? (
					contacts.map((contact: Contact, index: number) => (
						<ContactCard
							key={index}
							index={index}
							contact={contact}
							deleteContactByIndex={deleteContactByIndex}
							updateContactByIndex={updateContactByIndex}
							updateContactEmail={updateContactEmail}
							updateContactLocation={updateContactLocation}
							updateContactName={updateContactName}
							updateContactPhoneNumber={updateContactPhoneNumber}
						/>
					))
				) : (
					<div className="flex items-center justify-start gap-2">
						<FaUser size={16} />
						<p className="text-sm">Jelenleg nincsenek kontaktok</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ContactContaner;
