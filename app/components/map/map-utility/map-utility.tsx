'use client';

import { MdClose } from 'react-icons/md';
import Button from '../../shared/button/button';

interface MapUtilityProps {
	setShouldModifyUserLocation: any;
	isMapUtilityOpen: boolean;
	setIsMapUtilityOpen: any;
}

const MapUtility = ({
	setShouldModifyUserLocation,
	isMapUtilityOpen,
	setIsMapUtilityOpen
}: MapUtilityProps) => {
	return (
		<div
			className={`${
				isMapUtilityOpen ? 'translate-y-0' : '-translate-y-40'
			} absolute top-24 left-0 z-10 w-full bg-white p-2 shadow-md transition-transform md:w-auto lg:top-0 lg:p-6`}
		>
			<button
				className="absolute top-2 right-2 md:hidden"
				type="button"
				onClick={() => {
					setIsMapUtilityOpen(false);
				}}
			>
				<MdClose size={24} />
			</button>
			<Button
				text="Kiindulási pont módosítása"
				type="button"
				onClick={() => setShouldModifyUserLocation(true)}
			/>
		</div>
	);
};

export default MapUtility;
