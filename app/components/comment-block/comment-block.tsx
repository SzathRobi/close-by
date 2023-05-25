'use client';

import Textarea from '../shared/textarea/textarea';
import Button from '../shared/button/button';
import { useState } from 'react';
import { Comment } from '../../interfaces/comment.interface';

interface CommentBlockProps {
	comments: Comment[];
	setComments: any;
	calendarEventId: string;
}

const CommentBlock = ({
	calendarEventId,
	comments,
	setComments
}: CommentBlockProps) => {
	const [textAreaValue, setTextAreaValue] = useState<string>('');

	const padTo2Digits = (num: any) => {
		return num.toString().padStart(2, '0');
	};

	const formatDate = (date: any) => {
		return (
			[
				date.getFullYear(),
				padTo2Digits(date.getMonth() + 1),
				padTo2Digits(date.getDate())
			].join('-') +
			' ' +
			[
				padTo2Digits(date.getHours()),
				padTo2Digits(date.getMinutes())
			].join(':')
		);
	};

	const addComment = () => {
		const newComment: Comment = {
			calendarEventId,
			message: textAreaValue,
			createdAt: formatDate(new Date())
		};

		setComments([newComment, ...comments]);
	};

	const onSubmitComment = () => {
		addComment();
		setTextAreaValue('');
	};

	return (
		<div className="mb-12">
			<h4 className="mb-4">Megjegyzések</h4>
			<div>
				<Button
					className="mb-4"
					size="sm"
					type="button"
					text="Megjegyzés hozzáadása"
					onClick={() => onSubmitComment()}
				/>
				<Textarea
					name="comment"
					value={textAreaValue}
					onChange={(event: any) => {
						setTextAreaValue(event.target.value);
					}}
				/>
			</div>

			{comments.length ? (
				comments.map((comment: Comment, index: number) => (
					<div
						key={index}
						className="mb-2 rounded border border-gray-300 p-2 shadow"
					>
						<p>{comment.message}</p>
						<p className="text-sm text-gray-600">
							{comment.createdAt}
						</p>
					</div>
				))
			) : (
				<div></div>
			)}
		</div>
	);
};

export default CommentBlock;
