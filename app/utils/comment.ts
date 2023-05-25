import { Comment } from '../interfaces/comment.interface';

export const postComments = async (comments: Comment[]) => {
	const response = await fetch('/api/comments', {
		method: 'POST',
		body: JSON.stringify(comments)
	});

	const result = await response.json();

	return result;
};

export const getCommentsByCalendarEventId = async (calendrEventId: string) => {
	const response = await fetch(`/api/comments/${calendrEventId}`);

	const result = await response.json();

	return result;
};
