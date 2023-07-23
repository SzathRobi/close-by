import {
	getPhonenumberById,
	updatePhoneNumber
} from '../../../app/lib/mongo/phonenumbers';

const handler = async (request, response) => {
	if (request.method === 'GET') {
		try {
			const { id } = request.query;
			const { phoneNumber, error } = await getPhonenumberById(id);

			if (error) throw new Error(error);

			return response.status(200).json({ phoneNumber });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}

	if (request.method === 'PUT') {
		try {
			updatePhoneNumber(JSON.parse(request.body));

			// if (error) throw new Error(error);

			return response.status(200).json({ success: true });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}
};

export default handler;
