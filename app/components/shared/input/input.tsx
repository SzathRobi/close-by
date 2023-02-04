'use client';

import React from 'react';

interface InputProps {
	disabled?: boolean;
	errorMessage?: string;
	hasError?: boolean;
	icon?: any;
	onChange?: any;
	ref?: any;
	type?: string;
	min?: string | number;
	value?: string | number;
	name?: string;
	onIconClick?: any;
	autofocus?: boolean;
}

const Input = ({
	disabled = false,
	errorMessage,
	icon = null,
	min,
	onChange = null,
	ref = null,
	type = 'text',
	value,
	name,
	onIconClick = null,
	autofocus = false
}: InputProps) => {
	return (
		<div className="h-16 relative">
			<label>
				<input
					disabled={disabled}
					// ref={ref}
					type={type}
					min={min}
					name={name}
					value={value}
					autoFocus={autofocus}
					onChange={onChange}
					className={`w-full mb-1 shadow-md shadow-neutral-400 p-2 rounded ${
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

export default Input;
