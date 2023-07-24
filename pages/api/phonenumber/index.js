import {
	getPhonenumbers,
	postPhoneNumber
} from '../../../app/lib/mongo/phonenumbers';

const handler = async (request, response) => {
	if (request.method === 'GET') {
		try {
			const { phonenumbers, error } = await getPhonenumbers();

			if (error) throw new Error(error);

			return response.status(200).json({ phonenumbers });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}

	if (request.method === 'POST') {
		try {
			let bodyObject = JSON.parse(request.body);
			let myPhoneNumber = await postPhoneNumber(bodyObject);
			response.json({ success: true });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}
};

export default handler;
