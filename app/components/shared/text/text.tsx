type Size = 'sm' | 'md' | 'lg';

interface TextProps {
	size?: Size;
	children: any;
}

const Text = ({ children, size = 'md' }: TextProps) => {
	return (
		<p
			className={`${
				size === 'sm'
					? 'text-sm'
					: size === 'md'
					? 'text-base'
					: 'text-lg'
			}`}
		>
			{children}
		</p>
	);
};

export default Text;
