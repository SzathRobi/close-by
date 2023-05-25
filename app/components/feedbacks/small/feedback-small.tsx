import React from 'react';

interface FeedbackSmallProps {
	title?: string;
	text?: string;
	icon?: any;
	type: 'error' | 'success';
}

const FeedbackSmall = ({ icon, text, title, type }: FeedbackSmallProps) => {
	const styles = {
		feedback:
			'animate-feedback-ease-down-up w-72 p-4 fixed -top-20 left-1/2 z-40 transform -translate-x-1/2 flex items-center justify-center gap-6 rounded-md',
		error: 'bg-red-600',
		success: 'bg-green-600'
	};

	return (
		<div
			className={`${styles.feedback} ${
				type === 'error' && styles.error
			} ${type === 'success' && styles.success}`}
		>
			<div>{icon && icon}</div>
			<div className="flex flex-col justify-start items-start text-white">
				<p>{title && title}</p>
				<p className="text-sm">{text && text}</p>
			</div>
		</div>
	);
};

export default FeedbackSmall;
