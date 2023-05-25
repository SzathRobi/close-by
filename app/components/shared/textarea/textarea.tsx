'use client';

import React from 'react';

interface TextareaProps {
	disabled?: boolean;
	errorMessage?: string;
	hasError?: boolean;
	icon?: any;
	onChange?: any;
	ref?: any;
	value?: string | number;
	name?: string;
	onIconClick?: any;
	autofocus?: boolean;
}

const Textarea = ({
	disabled = false,
	errorMessage,
	icon = null,
	onChange = null,
	ref = null,
	value,
	name,
	onIconClick = null,
	autofocus = false
}: TextareaProps) => {
	return (
		<div className="h-16 relative mb-8">
			<label>
				<textarea
					id="textarea"
					disabled={disabled}
					// ref={ref}
					name={name}
					rows={3}
					value={value}
					autoFocus={autofocus}
					onChange={onChange}
					className={`w-full shadow-md shadow-neutral-400 p-2 rounded ${
						errorMessage && 'border-b-2 border-rose-600'
					} ${disabled && 'shadow-none'}`}
				/>
			</label>
			<button
				type="button"
				className="absolute right-2 top-2"
				onClick={onIconClick}
			>
				{icon}
			</button>
			{errorMessage && (
				<p className="text-sm text-rose-600">{errorMessage}</p>
			)}
		</div>
	);
};

export default Textarea;
