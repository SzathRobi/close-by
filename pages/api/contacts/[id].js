import { deleteContact, updateContact } from '../../../app/lib/mongo/contacts';

const handler = async (request, response) => {
	if (request.method === 'DELETE') {
		try {
			const { id } = request.query;
			deleteContact(id);

			// if (error) throw new Error(error);

			return response.status(200).json({ success: true });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}
	if (request.method === 'PUT') {
		try {
			const { id } = request.query;
			updateContact(id, JSON.parse(request.body));

			// if (error) throw new Error(error);

			return response.status(200).json({ success: true });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}
};

export default handler;
