import { getContacts, postContacts } from '../../../app/lib/mongo/contacts';

const handler = async (request, response) => {
	if (request.method === 'GET') {
		try {
			const { contacts, error } = await getContacts();

			if (error) throw new Error(error);

			return response.status(200).json({ contacts });
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}

	if (request.method === 'POST') {
		try {
			let bodyObject = JSON.parse(request.body);
			let myContact = await postContacts(bodyObject);
			response.json(myContact.ops[0]);
		} catch (error) {
			return response.status(500).json({ error: error.message });
		}
	}
};

export default handler;
