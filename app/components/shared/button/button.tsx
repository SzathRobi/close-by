import React from 'react';

type Size = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit';
type ButtonStatus = 'error' | 'idle' | 'success' | 'warning';

interface ButtonProps {
	disabled?: boolean;
	icon?: any;
	isLoading?: boolean;
	onClick?: any;
	secondary?: boolean;
	size?: Size;
	text: string;
	type: ButtonType;
	status?: ButtonStatus;
	className?: string;
	error?: boolean;
}

const Button = ({
	disabled = false,
	icon = null,
	onClick = null,
	secondary = false,
	size = 'md',
	text,
	type,
	status = 'idle',
	error = false,
	className = ''
}: ButtonProps) => {
	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={`${className} flex items-center justify-center gap-2 py-1 rounded-full shadow-sm shadow-gray-800 transition-colors  ${
				secondary &&
				!error &&
				'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-700'
			} ${
				error && 'border border-red-600 hover:bg-red-50 text-red-600'
			} ${disabled && 'bg-gray-500 text-white'} 
			${
				!error &&
				!secondary &&
				!disabled &&
				'bg-emerald-700 hover:bg-emerald-800 text-white'
			}
			${
				size === 'sm'
					? 'text-sm px-6 md:px-8'
					: text === 'md'
					? 'text-sm md:text-base px-6 md::px-14'
					: 'text-base px-6 md:px-14'
			}`}
		>
			<span>{text}</span>
			{icon ? <span>{icon}</span> : null}
		</button>
	);
};

export default Button;
