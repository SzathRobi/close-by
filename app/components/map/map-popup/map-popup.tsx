'use client';

import { Comment } from '@/app/interfaces/comment.interface';
import { Contact } from '@/app/interfaces/contact.interface';
import { EventData } from '@/app/interfaces/event-data.interface';
import { useEffect, useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import { Popup } from 'react-map-gl';

interface MapPopupProps {
	eventData: EventData | Contact;
	onClose: any;
	onModifyEvent: any;
	commentsFromDb: Comment[];
}

const MapPopup = ({
	commentsFromDb,
	eventData,
	onClose,
	onModifyEvent
}: MapPopupProps) => {
	if (!eventData) {
		return null;
	} else {
		const isEventData = (
			value: EventData | Contact
		): value is EventData => {
			return (value as EventData).summary !== undefined;
		};

		if (isEventData(eventData)) {
			const startDate = eventData.start.dateTime.split('T')[0];
			const startTime = eventData.start.dateTime
				.split('T')[1]
				.slice(0, 5);
			const endTime = eventData.end.dateTime.split('T')[1].slice(0, 5);

			const phoneNumberRegex = /\+\d{11}/gm;

			const [comments, setComments] = useState<Comment[]>([
				...commentsFromDb
			]);

			useEffect(() => {
				if (commentsFromDb.length) {
					setComments([...commentsFromDb]);
				}
			}, [commentsFromDb]);

			return (
				<Popup
					anchor="top"
					latitude={Number(eventData.coordinates?.lat)}
					longitude={Number(eventData.coordinates?.long)}
					onClose={onClose}
				>
					<h5 className="font-semibold">{eventData.summary}</h5>
					<p className="mb-2 min-w-[172px]">{eventData.location}</p>
					<p className="mb-4">
						{eventData.description
							? eventData.description.match(phoneNumberRegex)
							: 'nincs telefonszám megadva'}
					</p>

					{comments.length ? (
						<div className="mb-4">
							{comments.map((comment: Comment, index: number) => (
								<div
									key={index}
									className="mb-2 rounded border border-gray-300 p-2 shadow"
								>
									<p>{comment.message}</p>
									<p className="text-sm text-gray-600">
										{comment.createdAt}
									</p>
								</div>
							))}
						</div>
					) : (
						<div></div>
					)}

					<button
						className=" flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 py-0.5 px-8 text-[13px] text-white transition-colors hover:bg-emerald-800"
						onClick={() => onModifyEvent(eventData)}
					>
						Módosítás
						<BsPencil size={12} />
					</button>
				</Popup>
			);
		} else {
			return (
				<Popup
					anchor="top"
					latitude={Number(eventData.location?.coordinates?.latitude)}
					longitude={Number(
						eventData.location?.coordinates?.longitude
					)}
					onClose={onClose}
				>
					<h5 className="font-semibold">{eventData.email}</h5>
					<p className="mb-2 min-w-[172px]">{eventData.name}</p>
					{eventData.phoneNumber ? (
						<a
							href={`tel:${eventData.phoneNumber}`}
							className="mb-4"
						>
							{eventData.phoneNumber}
						</a>
					) : null}
				</Popup>
			);
		}
	}
};

export default MapPopup;
