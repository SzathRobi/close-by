'use client';

import { Contact } from '@/app/interfaces/contact.interface';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Button from '../../shared/button/button';
import Input from '../../shared/input/input';

interface AddContactFormProps {
	addContact: any;
	updateContactName?: any;
	updateContactEmail?: any;
}

const AddContactForm = ({ addContact }: AddContactFormProps) => {
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [phoneNumber, setPhoneNumber] = useState<string>('');

	const onSubmit = async (event: any) => {
		event.preventDefault();

		const newContact: Contact = {
			email,
			name,
			phoneNumber
		};

		let res = await fetch('/api/contacts', {
			method: 'POST',
			body: JSON.stringify(newContact)
		});
		res = await res.json();

		addContact(newContact);

		setName('');
		setEmail('');
		setPhoneNumber('');
	};

	return (
		<form
			id="add-contact-form"
			className="mb-4 rounded border-b-2 border-black border-opacity-30 bg-gray-200 p-2 pb-4 shadow-md"
			onSubmit={(event) => onSubmit(event)}
		>
			<div className="mb-2">
				<h4>Név</h4>
				<Input
					name="name"
					value={name}
					onChange={(event: any) => setName(event.target.value)}
				/>
			</div>
			<div className="mb-2">
				<h4>
					Email<span className="text-red-700">*</span>
				</h4>
				<Input
					required
					name="email"
					value={email}
					onChange={(event: any) => setEmail(event.target.value)}
				/>
			</div>
			<div className="mb-2">
				<h4>Telefonszám</h4>
				<Input
					name="phoneNumber"
					value={phoneNumber}
					onChange={(event: any) =>
						setPhoneNumber(event.target.value)
					}
				/>
			</div>

			<div className="flex items-center justify-start gap-4">
				<Button
					text="Hozzáadás"
					type="submit"
					size="sm"
					icon={<FaPlus />}
				/>
			</div>
		</form>
	);
};

export default AddContactForm;
