import React from 'react';

type Size = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit';

interface ButtonProps {
	disabled?: boolean;
	icon?: any;
	isLoading?: boolean;
	onClick?: any;
	secondary?: boolean;
	size?: Size;
	text: string;
	type: ButtonType;
}

const Button = ({
	disabled = false,
	icon = null,
	onClick = null,
	secondary = false,
	size = 'md',
	text,
	type
}: ButtonProps) => {
	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={`flex items-center justify-center py-1 px-4 text-white rounded shadow-sm shadow-gray-800 ${
				secondary
					? 'bg-white text-cyan-600 border border-cyan-600'
					: 'bg-cyan-600'
			} ${disabled && 'bg-gray-500'} ${
				size === 'sm'
					? 'text-sm'
					: text === 'md'
					? 'text-base'
					: 'text-lg'
			}`}
		>
			<span>{text}</span>
		</button>
	);
};

export default Button;
