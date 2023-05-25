import React from 'react';
import { MdClose } from 'react-icons/md';
import Button from '../../shared/button/button';
import Input from '../../shared/input/input';

interface ModifyUserLocationFormProps {
	onModifyUserLocationSubmit: any;
	closeLocationModifyModal: any;
}

const ModifyUserLocationForm = ({
	onModifyUserLocationSubmit,
	closeLocationModifyModal
}: ModifyUserLocationFormProps) => {
	return (
		<div className="p-2">
			<div className="mb-4 flex items-center justify-end">
				<button
					className="text-gray-500 hover:text-gray-700 transition-colors"
					onClick={() => closeLocationModifyModal()}
				>
					<MdClose size={24} />
				</button>
			</div>
			<form
				className="bg-white rounded mb-2"
				onSubmit={(event: any) => onModifyUserLocationSubmit(event)}
			>
				<div className="mb-6">
					<p className="font-medium mb-4">
						Új helyszín<span className="text-red-700">*</span>:
					</p>
					<Input name="location" required />
				</div>

				<div className="flex items-center justify-end gap-4">
					<Button
						text="Mégse"
						type="button"
						size="sm"
						secondary
						onClick={() => closeLocationModifyModal()}
					/>
					<Button text="Módosítás" type="submit" size="sm" />
				</div>
			</form>
		</div>
	);
};

export default ModifyUserLocationForm;
