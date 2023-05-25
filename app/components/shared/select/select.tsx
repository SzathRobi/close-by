'use client';

import { eventTypes } from '@/app/constants/event-constans';
import { EventType } from '@/app/interfaces/event-type.interface';
import { useState } from 'react';
import Input from '../input/input';

interface SelectProps {
	label: string;
	selectValue: any;
	setSelectValue: any;
}

const Select = ({ label, selectValue, setSelectValue }: SelectProps) => {
	const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

	const toggleDropDown = () => {
		setIsDropDownOpen(!isDropDownOpen);
	};

	const closeDropwDown = () => {
		setIsDropDownOpen(false);
	};

	const onOptionClick = (eventType: EventType) => {
		setSelectValue(eventType);
		closeDropwDown();
	};

	const getTypeColor = (color: string): string => {
		if (color === 'blue') {
			return 'before:bg-blue-400';
		}
		if (color === 'red') {
			return 'before:bg-red-400';
		}
		if (color === 'indigo') {
			return 'before:bg-indigo-400';
		}

		return 'bg-blue-400';
	};

	const getTypeColor2 = (color: string): string => {
		if (color === 'blue') {
			return 'bg-blue-400';
		}
		if (color === 'red') {
			return 'bg-red-400';
		}
		if (color === 'indigo') {
			return 'bg-indigo-400';
		}

		return 'bg-blue-400';
	};

	return (
		<div className="mb-8">
			<h3>{label}</h3>
			<div className="relative">
				<Input
					value={selectValue.type}
					onClick={() => toggleDropDown()}
				/>
				<div
					className={`absolute top-3 right-4 h-4 w-4 rounded ${getTypeColor2(
						selectValue.color
					)}`}
				></div>
			</div>

			{isDropDownOpen ? (
				<div className="flex w-full flex-col items-start justify-start shadow">
					{eventTypes.map((eventType: EventType) => (
						<button
							onClick={() => onOptionClick(eventType)}
							className={`relative w-full p-2 text-left transition-colors before:absolute before:top-4 before:right-4 before:h-4 before:w-4 before:rounded hover:bg-gray-200 ${getTypeColor(
								eventType.color
							)}`}
							key={eventType.type}
						>
							{eventType.type}
							<span>{}</span>
						</button>
					))}
				</div>
			) : null}
		</div>
	);
};

export default Select;
