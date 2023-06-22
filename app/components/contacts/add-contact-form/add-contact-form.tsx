'use client';

import { ContactLocation } from '@/app/interfaces/contact-location.interface';
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
	const [location, setLocation] = useState<ContactLocation | undefined>(
		undefined
	);

	const onSubmit = async (event: any) => {
		event.preventDefault();

		let newContact: Contact = {
			email,
			name,
			phoneNumber,
			location
		};

		if (location?.locationName.length) {
			const response = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.locationName}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
			);

			const data = await response.json();

			setLocation({
				...location,
				coordinates: {
					longitude: data.features[0].center[0],
					latitude: data.features[0].center[1]
				}
			});

			newContact = {
				...newContact,
				location: {
					locationName: location.locationName,
					coordinates: {
						longitude: data.features[0].center[0],
						latitude: data.features[0].center[1]
					}
				}
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
		} else {
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
		}
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
			<div className="mb-2">
				<h4>Helyszín</h4>
				<Input
					name="location"
					value={location?.locationName}
					onChange={(event: any) =>
						setLocation({
							coordinates: undefined,
							locationName: event.target.value
						})
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
