import {
	deleteComment,
	getComments,
	getCommentsById,
	postComments,
	updateComment
} from '../../../app/lib/mongo/comments';

const handler = async (request, response) => {
	if (request.method === 'GET') {
		try {
			const { id } = request.query;
			const { comment, error } = await getCommentsById(id);

			if (error) throw new Error(error);

			return response.status(200).json({ comment });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}

	if (request.method === 'DELETE') {
		try {
			const { id } = request.query;
			deleteComment(id);

			// if (error) throw new Error(error);

			return response.status(200).json({ success: true });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}

	if (request.method === 'PUT') {
		try {
			updateComment(JSON.parse(request.body));

			// if (error) throw new Error(error);

			return response.status(200).json({ success: true });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}
};

export default handler;
