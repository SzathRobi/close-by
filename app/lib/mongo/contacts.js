import clientPromise from '.';

let client;
let db;
let contacts;

async function init() {
	if (db) return;
	try {
		client = await clientPromise;
		db = await client.db('contacts-db');
		contacts = await db.collection('contacts');
	} catch (error) {
		throw new Error('Failed to stablish connection to database');
	}
}

(async () => {
	await init();
})();

////////////////
/// CONTACTS ///
////////////////

export async function getContacts() {
	try {
		if (!contacts) await init();

		const result = await contacts
			.find()
			.map((user) => ({ ...user, _id: user._id.toString() }))
			.toArray();

		return { contacts: result };
	} catch (error) {
		return { error: 'Failed to get contacts' };
	}
}

export async function postContacts(bodyObject) {
	try {
		await init();

		return await db.collection('contacts').insertOne(bodyObject);
	} catch (error) {
		return { error: 'Failed to post contact' };
	}
}

export async function deleteContact(id) {
	try {
		await init();

		await db.collection('contacts').deleteOne({ id });
	} catch (error) {
		return { error: 'Failed to delete contact' };
	}
}

export async function updateContact(id, bodyObject) {
	try {
		await init();

		const setContact = {
			$set: {
				id: bodyObject.id,
				name: bodyObject.name,
				email: bodyObject.email,
				phoneNumber: bodyObject.phoneNumber,
				location: bodyObject.location
			}
		};

		await db.collection('contacts').updateOne({ id }, setContact);
	} catch (error) {
		return { error: 'Failed to update contact' };
	}
}
