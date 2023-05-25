import { getComments, postComments } from '../../../app/lib/mongo/comments';

const handler = async (request, response) => {
	if (request.method === 'GET') {
		try {
			const { comments, error } = await getComments();

			if (error) throw new Error(error);

			return response.status(200).json({ comments });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}

	if (request.method === 'POST') {
		try {
			let bodyObject = JSON.parse(request.body);
			let myComments = await postComments(bodyObject);
			response.json({ success: true });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}
};

export default handler;
