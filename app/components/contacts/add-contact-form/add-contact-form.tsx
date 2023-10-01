'use client';

import { ContactLocation } from '@/app/interfaces/contact-location.interface';
import { Contact } from '@/app/interfaces/contact.interface';
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
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
	const [location, setLocation] = useState<ContactLocation | undefined>(
		undefined
	);

	const onSubmit = async (event: any) => {
		event.preventDefault();

		if (email === '' && name === '' && phoneNumber === '') {
			alert('A helyszín mezőn kívül legalább 1 mezőt tölts ki.');
			return;
		}

		let newContact: Contact = {
			id: uuidv4(),
			email,
			name,
			phoneNumber,
			location
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
		setLocation({
			locationName: '',
			coordinates: undefined
		});
	};

	const suggestionSelect = (
		result: string,
		lat: number,
		lng: number,
		text: string
	) => {
		const newLocation: ContactLocation = {
			locationName: text,
			coordinates: {
				latitude: lat.toString(),
				longitude: lng.toString()
			}
		};

		setLocation(newLocation);
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
				<h4>Email</h4>
				<Input
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
			<div className="mb-2">
				<h4>Helyszín</h4>
				<MapboxAutocomplete
					publicKey={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
					inputClass="mb-1 w-full rounded p-2 shadow-md shadow-neutral-400"
					onSuggestionSelect={suggestionSelect}
					country="hu"
					resetSearch={false}
					query={location?.locationName}
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
