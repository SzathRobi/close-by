'use client';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { useState } from 'react';
import { Attendant } from '@/app/interfaces/attendant.interface';
import { EventData } from '@/app/interfaces/event-data.interface';

import Button from '../shared/button/button';
import Input from '../shared/input/input';
import AttendantCard from './attendant-card';

interface EventFormProps {
	calendarEvent?: EventData;
	email: string;
	token: string;
}

const EventForm = ({
	calendarEvent = undefined,
	email,
	token
}: EventFormProps) => {
	const [attendants, setAttendants] = useState<Attendant[]>([]);
	const addAttendant = () => {
		setAttendants([...attendants, { email: '' }]);
	};

	const updateAttendant = (event: any, index: number) => {
		setAttendants(
			attendants.map((attendant: Attendant, innerIndex: number) =>
				index === innerIndex
					? { ...attendant, email: event.target.value }
					: attendant
			)
		);
	};

	const deleteAttendant = (index: number) => {
		const filteredAttendants = attendants.filter(
			(attendant: Attendant, innerIndex: number) => index !== innerIndex
		);
		setAttendants(filteredAttendants);
	};

	const deleteByIndex = (index: number) => {
		setAttendants((oldValues: any) => {
			return oldValues.filter((_: any, i: any) => i !== index);
		});
	};

	const handleSubmit = async (event: any, email: string, token: string) => {
		event.preventDefault();

		const testEvent = {
			summary: event.target.title.value,
			description: event.target.description.value,
			location: event.target.location.value,
			start: {
				dateTime: `${event.target.start.value}:00`,
				timeZone: 'Europe/Budapest'
			},
			end: {
				dateTime: `${event.target.end.value}:00`,
				timeZone: 'Europe/Budapest'
			},
			reminders: {
				useDefault: true
			},
			attendees: attendants
		};

		const JSONdata = JSON.stringify(testEvent);

		const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${email}/events`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSONdata
		};

		const response = await fetch(endpoint, options);

		const result = await response.json();
	};

	return (
		<form
			action="/api/hello"
			method="post"
			onSubmit={(event) => handleSubmit(event, email, token)}
		>
			<div>
				<h3 className="font-medium mb-2">Cím:</h3>
				<Input name="title" />
			</div>
			<div>
				<h3 className="font-medium mb-2">Leírás:</h3>
				{
					// TODO: create TextArea component
				}
				<Input name="description" />
			</div>
			<div>
				<h3 className="font-medium mb-2">Kezdet:</h3>
				<Input name="start" type="datetime-local" />
			</div>
			<div>
				<h3 className="font-medium mb-2">Vége:</h3>
				<Input name="end" type="datetime-local" />
			</div>
			<div>
				<h3 className="font-medium mb-2">Helyszín:</h3>
				<Input name="location" />
			</div>
			<div>
				<h3 className="font-medium mb-2">Résztvevők:</h3>
				<Button
					type="button"
					text="hozzáadás"
					size="sm"
					onClick={addAttendant}
				/>
				<div>
					{attendants.length > 0 ? (
						attendants.map(
							(attendant: Attendant, index: number) => (
								<Input
									key={index}
									autofocus
									name={`attendant-email-${index}`}
									value={attendant.email}
									icon={
										<RiDeleteBin6Line
											size={24}
											className="text-red-600"
										/>
									}
									onIconClick={() => deleteByIndex(index)}
									onChange={(event: any) =>
										updateAttendant(event, index)
									}
								/>
							)
						)
					) : (
						<div>
							<p>Nincsenek résztvevők</p>
						</div>
					)}
				</div>
			</div>
			<div>
				<h3 className="font-medium mb-2">Csatlakozás:</h3>
				<a href="#">hátétépé://eskü_biztonságos.com/vagynem</a>
			</div>
			<Button type="submit" text="Létrehozás" />
			{/* <div className="mb-0 flex gap-2">
				<Button text={'Mégse'} onClick={null} secondary />
				<Button text={'Hozzáadás'} onClick={null} />
			</div> */}
		</form>
	);
};

export default EventForm;
