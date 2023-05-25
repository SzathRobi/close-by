'use client';

import { FaSearch } from 'react-icons/fa';
import Input from '../input/input';

interface SearchInputProps {
	onSearchEvent: any;
	onSearchInputChange: any;
}

const SearchInput = ({
	onSearchEvent,
	onSearchInputChange
}: SearchInputProps) => {
	return (
		<form
			className="relative mb-6 w-full px-2"
			onSubmit={(event: any) => {
				onSearchEvent(event);
			}}
		>
			<Input name="search" onChange={onSearchInputChange} />
			<button className="absolute top-0 right-2 flex h-10 w-12 items-center justify-center rounded bg-emerald-700 shadow-md shadow-neutral-400 transition-colors hover:bg-emerald-800">
				<FaSearch color="#fff" size={16} />
			</button>
		</form>
	);
};

export default SearchInput;
