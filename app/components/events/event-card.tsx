import React from 'react';
import { BsPencil } from 'react-icons/bs';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { EventData } from '@/app/interfaces/event-data.interface';

import Button from '../shared/button/button';

interface EventCardProps {
	eventData: EventData;
	onUpdateButtonClick: any;
	onMarkerOpen: any;
	searchValue: string;
}

const EventCard = ({
	eventData,
	onUpdateButtonClick,
	onMarkerOpen,
	searchValue
}: EventCardProps) => {
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

	const startDate = eventData.start.dateTime.split('T')[0];
	const startTime = eventData.start.dateTime.split('T')[1].slice(0, 5);
	const endTime = eventData.end.dateTime.split('T')[1].slice(0, 5);

	const phoneNumberRegex = /\+\d{11}/gm;

	const getEventTypeColor = (color: string | undefined): string => {
		if (!color) {
			return 'bg-blue-400';
		}
		if (color === '11') {
			return 'bg-red-400';
		}
		if (color === '8') {
			return 'bg-gray-500';
		}
		if (color === '1') {
			return 'bg-purple-300';
		}

		return 'bg-blue-400';
	};

	return (
		<article className="relative mt-4 flex w-full flex-col rounded-lg bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.4)] transition duration-200">
			<div
				className={`absolute top-4 right-4 h-4 w-4 rounded ${getEventTypeColor(
					eventData.colorId
				)}`}
			></div>
			<p className="mb-2 text-sm text-gray-600">
				{getHighlightedText(
					eventData.location || 'nincs megadva helyszín'
				)}
			</p>
			<div className="mb-4">
				<h4 className="mb-2 text-xl font-medium">
					{getHighlightedText(eventData.summary)}
				</h4>
				<p>{getHighlightedText(eventData.description)}</p>
			</div>

			<div className="items center mb-4 flex justify-start gap-4">
				<p>{startDate}</p>
				<p>
					{startTime} - {endTime}
				</p>
			</div>

			<p className="mb-4">
				Telefonszám:{' '}
				{(eventData.description &&
					eventData.description.match(phoneNumberRegex)) ||
					'nincs megadva'}
			</p>

			<p className="mb-6">{eventData.attendees.length} résztvevő</p>

			<div className="flex items-center justify-between">
				<Button
					text="Módosítás"
					type="button"
					icon={<BsPencil />}
					size="sm"
					className="w-48"
					onClick={onUpdateButtonClick}
				/>

				{eventData.location ? (
					<button
						type="button"
						className="rounded-full border border-emerald-700 p-3 transition-colors hover:bg-emerald-50"
						onClick={(event) =>
							eventData.location
								? onMarkerOpen(event, eventData, true)
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

export default EventCard;
