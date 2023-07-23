import clientPromise from '.';

let client;
let db;
let phonenumbers;

async function init() {
	if (db) return;
	try {
		client = await clientPromise;
		db = await client.db('phonenumbers-db');
		phonenumbers = await db.collection('phonenumbers');
	} catch (error) {
		throw new Error('Failed to stablish connection to database');
	}
}

(async () => {
	await init();
})();

////////////////////
/// PHONENUMBERS ///
////////////////////

export async function getPhonenumbers() {
	try {
		if (!phonenumbers) await init();

		const result = await phonenumbers.find().limit(100).toArray();

		return { phonenumbers: result };
	} catch (error) {
		return { error: 'Failed to get phonenumbers' };
	}
}

export async function getPhonenumberById(calendarEventId) {
	try {
		if (!phonenumbers) await init();

		const result = await phonenumbers.find({ calendarEventId }).toArray();

		return { phoneNumber: result };
	} catch (error) {
		return { error: 'Failed to get phonenumber : ' + error };
	}
}

export async function postPhoneNumber(bodyObject) {
	try {
		await init();

		return await db.collection('phonenumbers').insertOne(bodyObject);
	} catch (error) {
		return { error: 'Failed to post phonenumber' };
	}
}

export async function updatePhoneNumber(bodyObject) {
	try {
		await init();

		const setPhoneNumber = {
			$set: {
				phoneNumber: bodyObject.phoneNumber,
				calendarEventId: bodyObject.calendarEventId
			}
		};

		await db
			.collection('phonenumbers')
			.updateOne(
				{ calendarEventId: bodyObject.calendarEventId },
				setPhoneNumber
			);
	} catch (error) {
		return { error: 'Failed to update phone number' };
	}
}
