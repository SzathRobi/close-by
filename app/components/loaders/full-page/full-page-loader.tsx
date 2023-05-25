import InlineLoader from '../inline/inline-loader';

const FullPageLoader = () => {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<InlineLoader size={120} />
		</div>
	);
};

export default FullPageLoader;
