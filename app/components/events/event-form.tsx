'use client';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { Attendant } from '@/app/interfaces/attendant.interface';
import { EventData } from '@/app/interfaces/event-data.interface';

import Button from '../shared/button/button';
import Input from '../shared/input/input';
import { deleteEvent, postEvent, updateEvent } from '@/app/utils/event';
import Textarea from '../shared/textarea/textarea';
import CommentBlock from '../comment-block/comment-block';
import InlineLoader from '../loaders/inline/inline-loader';
import { Contact } from '@/app/interfaces/contact.interface';
import { FaUser } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Select from '../shared/select/select';
import { eventTypes } from '@/app/constants/event-constans';
import { EventType } from '@/app/interfaces/event-type.interface';
import { postComments } from '@/app/utils/comment';
import { Comment } from '@/app/interfaces/comment.interface';

interface EventFormProps {
	calendarEvent?: EventData;
	email: string;
	token: string;
	selectedEvent?: EventData | undefined;
	setSelectedEvent?: any;
	feedbackStatus: any;
	setFeedbackStatus: any;
	closeModal: any;
	setFeedbackText: any;
	addNewEvent: any;
	updateSelectedEvent: any;
	deleteCurrentEvent: any;
	contacts: Contact[];
	filterableContacts: Contact[];
	commentsFromDb: Comment[];
}

const EventForm = ({
	selectedEvent = undefined,
	email,
	token,
	setSelectedEvent = null,
	feedbackStatus,
	setFeedbackStatus,
	closeModal,
	setFeedbackText,
	addNewEvent,
	updateSelectedEvent,
	deleteCurrentEvent,
	contacts,
	filterableContacts,
	commentsFromDb
}: EventFormProps) => {
	const [attendants, setAttendants] = useState<Attendant[]>(
		selectedEvent?.attendees ? selectedEvent.attendees : []
	);

	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [comments, setComments] = useState<Comment[]>([]);

	useEffect(() => {
		setComments(commentsFromDb);
	}, [commentsFromDb]);

	const getEventType = (event: EventData): EventType => {
		if (event.colorId === '8') {
			return eventTypes[3];
		}

		if (event.colorId === '1') {
			return eventTypes[2];
		}

		if (event.colorId === '11') {
			return eventTypes[1];
		}

		return eventTypes[0];
	};

	const [selectValue, setSelectValue] = useState<EventType>(
		selectedEvent ? getEventType(selectedEvent) : eventTypes[0]
	);

	const addAttendant = () => {
		setAttendants([...attendants, { email: '', status: 'needsAction' }]);
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

	const deleteAttendantByIndex = (index: number) => {
		setAttendants((oldValues: any) => {
			return oldValues.filter((_: any, i: any) => i !== index);
		});
	};

	const getColorId = (color: string) => {
		if (color === 'red') {
			return '11';
		}

		if (color === 'gray') {
			return '8';
		}

		if (color === 'purple') {
			return '1';
		}

		return null;
	};

	const handleSubmit = async (event: any, email: string, token: string) => {
		event.preventDefault();

		setIsSubmitting(true);
		setFeedbackStatus('loading');

		const response = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.location.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
		);

		const data = await response.json();

		const newEvent = {
			colorId: getColorId(selectValue.color),
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
			attendees: attendants,
			coordinates: {
				long: data.features[0].center[0],
				lat: data.features[0].center[1]
			}
		};

		if (selectedEvent) {
			updateEvent(token, email, newEvent, selectedEvent.id!)
				.then((response: any) => {
					if (response.status === 'confirmed') {
						setFeedbackStatus('success');
						setFeedbackText('Az esemény sikeresen frissült!');

						setTimeout(() => {
							setFeedbackStatus('idle');
							setFeedbackText('');
						}, 7000);

						updateSelectedEvent({
							...newEvent,
							id: selectedEvent.id
						});

						setIsSubmitting(false);
						closeModal();

						return;
					}

					setFeedbackStatus('error');
					setFeedbackText(
						'Az esemény frissítése sikertelen volt. Kérlek próbáld meg újra!'
					);

					setTimeout(() => {
						setFeedbackStatus('idle');
						setFeedbackText('');
					}, 7000);

					closeModal();
				})
				.then(() => {
					postComments(comments);
				});
			return;
		}

		postEvent(token, email, newEvent).then((response) => {
			if (response.status === 'confirmed') {
				setTimeout(() => {
					setFeedbackStatus('idle');
				}, 7000);

				setFeedbackStatus('success');
				setFeedbackText('Az esemény sikeresen létrejött!');

				addNewEvent({ ...newEvent, id: response.id });
				setIsSubmitting(false);
				closeModal();
				return;
			}

			setFeedbackStatus('error');
			setFeedbackText(
				'Az esemény létrehozása sikertelen volt. Kérlek próbáld meg újra!'
			);

			setTimeout(() => {
				setFeedbackStatus('idle');
			}, 7000);

			closeModal();
		});
	};

	const deleteSelectedEvent = (eventId: string) => {
		setFeedbackStatus('loading');
		setIsDeleting(true);
		deleteEvent(token, email, eventId).then((response) => {
			if (response.ok) {
				setFeedbackStatus('success');
				setFeedbackText('Az esemény sikeresen törlődött!');

				setTimeout(() => {
					setFeedbackStatus('idle');
					setFeedbackText('');
				}, 7000);

				deleteCurrentEvent(eventId);
				setIsDeleting(false);
				closeModal();

				return;
			}

			setFeedbackStatus('error');
			setFeedbackText(
				'Az esemény törlése sikertelen volt. Kérlek próbáld meg újra!'
			);

			setTimeout(() => {
				setFeedbackStatus('idle');
				setFeedbackText('');
			}, 7000);

			closeModal();
		});
	};

	return (
		<form
			className="py-8"
			onSubmit={(event) => handleSubmit(event, email, token)}
		>
			<div className="mb-4 flex items-center justify-end">
				<button
					type="button"
					className="text-gray-500 transition-colors hover:text-gray-700"
					onClick={() => closeModal()}
				>
					<MdClose size={24} />
				</button>
			</div>
			<h2 className="mb-4 text-xl font-medium">
				Esemény {selectedEvent ? 'módosítása' : 'hozzáadása'}
			</h2>
			<div className="mb-6">
				<h3 className="mb-2 font-medium">
					Cím<span className="text-red-700">*</span>:
				</h3>
				<Input
					required
					name="title"
					value={selectedEvent ? selectedEvent.summary : undefined}
					onChange={
						selectedEvent
							? (event: any) =>
									setSelectedEvent({
										...selectedEvent,
										summary: event.target.value
									})
							: null
					}
				/>
			</div>
			<div className="mb-12">
				<h3 className="mb-2 font-medium">Leírás:</h3>
				<Textarea
					name="description"
					value={
						selectedEvent ? selectedEvent.description : undefined
					}
					onChange={
						selectedEvent
							? (event: any) =>
									setSelectedEvent({
										...selectedEvent,
										description: event.target.value
									})
							: null
					}
				/>
			</div>
			<div className="mb-6">
				<h3 className="mb-2 font-medium">
					Kezdet<span className="text-red-700">*</span>:
				</h3>
				<Input
					required
					name="start"
					type="datetime-local"
					value={
						selectedEvent &&
						!selectedEvent.start.dateTime.includes('+')
							? selectedEvent.start.dateTime
							: selectedEvent
							? `${selectedEvent.start.dateTime
									.replace('T', ' ')
									.slice(0, -6)}`
							: undefined
					}
					onChange={
						selectedEvent
							? (event: any) =>
									setSelectedEvent({
										...selectedEvent,
										start: {
											...selectedEvent.start,
											dateTime: `${event.target.value}:00`
										}
									})
							: null
					}
				/>
			</div>
			<div className="mb-6">
				<h3 className="mb-2 font-medium">
					Vége<span className="text-red-700">*</span>:
				</h3>
				<Input
					required
					name="end"
					type="datetime-local"
					value={
						selectedEvent &&
						!selectedEvent.end.dateTime.includes('+')
							? selectedEvent.end.dateTime
							: selectedEvent
							? `${selectedEvent.end.dateTime
									.replace('T', ' ')
									.slice(0, -6)}`
							: undefined
					}
					onChange={
						selectedEvent
							? (event: any) =>
									setSelectedEvent({
										...selectedEvent,
										end: {
											...selectedEvent.end,
											dateTime: `${event.target.value}:00+02:00`
										}
									})
							: null
					}
				/>
			</div>
			<div className="mb-6">
				<h3 className="mb-2 font-medium">
					Helyszín<span className="text-red-700">*</span>:
				</h3>
				<Input
					required
					name="location"
					value={selectedEvent ? selectedEvent.location : undefined}
					onChange={
						selectedEvent
							? (event: any) =>
									setSelectedEvent({
										...selectedEvent,
										location: event.target.value
									})
							: null
					}
				/>
			</div>
			<div className="mb-6">
				<h3 className="mb-4 font-medium">Résztvevők:</h3>
				<Button
					className="mb-2"
					type="button"
					text="hozzáadás"
					size="sm"
					onClick={addAttendant}
				/>
				<div className="mb-12 pt-4">
					{attendants.length > 0 ? (
						attendants.map(
							(attendant: Attendant, index: number) => (
								<div key={index}>
									<Input
										autofocus
										name={`attendant-email-${index}`}
										value={attendant.email}
										icon={
											<RiDeleteBin6Line
												size={24}
												className="text-red-600"
											/>
										}
										onIconClick={() =>
											deleteAttendantByIndex(index)
										}
										onChange={(event: any) =>
											updateAttendant(event, index)
										}
									/>
								</div>
							)
						)
					) : (
						<div className="flex items-center justify-start gap-4 ">
							<FaUser size={16} />
							<p className="text-sm">
								Jelenleg nincsenek résztvevők
							</p>
						</div>
					)}
				</div>
			</div>
			<div>
				<Select
					label="Típus"
					selectValue={selectValue}
					setSelectValue={setSelectValue}
				/>
			</div>
			{selectedEvent ? (
				<CommentBlock
					calendarEventId={selectedEvent.calendarEventId}
					comments={comments}
					setComments={setComments}
				/>
			) : null}
			<div className="mt-6 flex items-center justify-start gap-4">
				{selectedEvent && (
					<Button
						type="button"
						text="Törlés"
						secondary
						error
						icon={
							feedbackStatus === 'loading' && isDeleting ? (
								<InlineLoader size={20} />
							) : null
						}
						onClick={() => deleteSelectedEvent(selectedEvent.id!)}
					/>
				)}
				<Button
					type="submit"
					text={selectedEvent ? 'Frissítés' : 'Létrehozás'}
					icon={
						feedbackStatus === 'loading' && isSubmitting ? (
							<InlineLoader size={20} color="#fff" />
						) : null
					}
				/>
			</div>
		</form>
	);
};

export default EventForm;
