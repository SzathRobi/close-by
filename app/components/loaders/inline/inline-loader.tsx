import styles from './inline-loader.module.css';

const InlineLoader = ({ size = 40, color = '#059669' }) => {
	const outerLoaderStyle = {
		width: size,
		height: size
	};

	const innerLoaderStyle = {
		width: size * 0.8,
		height: size * 0.8,
		borderWidth: size * 0.125,
		borderColor: `${color} transparent transparent transparent`
	};

	return (
		<span className={styles['lds-ring']} style={outerLoaderStyle}>
			<span style={innerLoaderStyle}></span>
			<span style={innerLoaderStyle}></span>
			<span style={innerLoaderStyle}></span>
			<span style={innerLoaderStyle}></span>
		</span>
	);
};

export default InlineLoader;
