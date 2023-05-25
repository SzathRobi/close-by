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
	placeholder?: string;
	onIconClick?: any;
	onClick?: any;
	autofocus?: boolean;
	onKeyDown?: any;
	required?: boolean;
	onFocus?: any;
	onBlur?: any;
}

const Input = ({
	disabled = false,
	errorMessage,
	icon = null,
	min,
	placeholder = '',
	onChange = null,
	ref = null,
	type = 'text',
	value,
	name,
	onIconClick = null,
	autofocus = false,
	onKeyDown = null,
	required = false,
	onFocus = null,
	onBlur = null,
	onClick = null
}: InputProps) => {
	return (
		<div className="relative">
			<label>
				<input
					disabled={disabled}
					required={required}
					// ref={ref}
					type={type}
					placeholder={placeholder}
					min={min}
					name={name}
					value={value}
					onClick={onClick}
					autoFocus={autofocus}
					onChange={onChange}
					onKeyDown={onKeyDown}
					onFocus={onFocus}
					onBlur={onBlur}
					className={`w-full mb-1 shadow-md shadow-neutral-400 p-2 rounded ${
						errorMessage && 'border-b-2 border-rose-600'
					} ${disabled && 'shadow-none border-none'}`}
				/>
			</label>
			{icon && (
				<button
					type="button"
					className="absolute right-2 top-2"
					onClick={onIconClick}
				>
					{icon}
				</button>
			)}
			{errorMessage && (
				<p className="text-sm text-rose-600">{errorMessage}</p>
			)}
		</div>
	);
};

export default Input;
