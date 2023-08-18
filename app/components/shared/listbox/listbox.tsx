'use client';

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { RiArrowUpDownLine } from 'react-icons/ri';
import { SelectOption } from '@/app/types/select-option.type';
import { FaCheck, FaUser } from 'react-icons/fa';

const options: SelectOption[] = [
	'Összes',
	'Esemény',
	'Hívandó',
	'Kérdőív',
	'Meglévő'
];

type FilterListBoxProps = {
	selectedFilters: SelectOption[];
	setSelectedFilters: Dispatch<SetStateAction<SelectOption[]>>;
};

const FilterListBox = ({
	selectedFilters,
	setSelectedFilters
}: FilterListBoxProps) => {
	const getTypeColor = (option: SelectOption): string => {
		if (option === 'Esemény') {
			return 'bg-blue-400';
		}

		if (option === 'Hívandó') {
			return 'bg-red-400';
		}

		if (option === 'Kérdőív') {
			return 'bg-gray-400';
		}

		if (option === 'Meglévő') {
			return 'bg-purple-300';
		}

		return 'bg-blue-400';
	};

	const onSelectChange = (events: SelectOption[]) => {
		if (events[events.length - 1] === 'Összes' || events.length === 0) {
			setSelectedFilters(['Összes']);
			return;
		}

		if (events[0] === 'Összes') {
			const filteredArray = events.filter((event) => event !== 'Összes');
			setSelectedFilters(filteredArray);
			return;
		}

		setSelectedFilters(events);
	};

	return (
		<Listbox
			value={selectedFilters}
			onChange={(stuff: SelectOption[]) => onSelectChange(stuff)}
			multiple
		>
			<div className="relative mt-1">
				<Listbox.Button className="relative h-9 w-full cursor-default rounded-lg bg-blue-50 py-2 pl-3 pr-10 text-left shadow-md shadow-neutral-400 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:text-sm">
					<span className="block truncate">
						{selectedFilters.map((filter) => filter).join(', ')}
					</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-md bg-emerald-700 px-2">
						<RiArrowUpDownLine
							className="h-5 w-5 text-white"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{options.map((option, index) => (
							<Listbox.Option
								key={index}
								className={({ active }) =>
									`relative cursor-default select-none py-2 pl-10 pr-4 ${
										active
											? 'bg-emerald-100 text-emerald-900'
											: 'text-gray-900'
									}`
								}
								value={option}
							>
								{({ selected }) => (
									<>
										<span
											className={`block truncate ${
												selected
													? 'font-medium'
													: 'font-normal'
											}`}
										>
											{option}
										</span>
										{index === 0 ? null : index === 4 ? (
											<div className="absolute top-2.5 right-4 rounded">
												<FaUser size={12} />
											</div>
										) : (
											<div
												className={`absolute top-2.5 right-4 h-4 w-4 rounded ${getTypeColor(
													option
												)}`}
											></div>
										)}
										{selected ? (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
												<FaCheck
													className="h-5 w-5"
													aria-hidden="true"
												/>
											</span>
										) : null}
									</>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
};

export default FilterListBox;
