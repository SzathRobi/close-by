import clientPromise from '.';

let client;
let db;
let comments;

async function init() {
	if (db) return;
	try {
		client = await clientPromise;
		db = await client.db('comments-db');
		comments = await db.collection('comments');
	} catch (error) {
		throw new Error('Failed to stablish connection to database');
	}
}

(async () => {
	await init();
})();

////////////////
/// COMMENTS ///
////////////////

export async function getCommentsById(calendarEventId) {
	try {
		if (!comments) await init();

		const result = await comments.find({ calendarEventId }).toArray();

		return { comment: result };
	} catch (error) {
		return { error: 'Failed to get comments : ' + error };
	}
}

export async function getAllComments() {
	try {
		if (!comments) await init();

		const result = await comments.find().limit(100).toArray();

		return { comments: result };
	} catch (error) {
		return { error: 'Failed to get comments' };
	}
}

export async function postComments(bodyObject) {
	try {
		await init();

		return await db.collection('comments').insertMany(bodyObject);
	} catch (error) {
		return { error: 'Failed to post comment' };
	}
}

export async function deleteComment(calendarEventId) {
	try {
		await init();

		await db.collection('comments').deleteOne({ calendarEventId });
	} catch (error) {
		return { error: 'Failed to delete contact' };
	}
}

export async function updateComment(bodyObject) {
	try {
		await init();

		const setComment = {
			$set: {
				message: bodyObject.message,
				createdAt: bodyObject.createdAt,
				calendarEventId: bodyObject.calendarEventId
			}
		};

		await db
			.collection('comments')
			.updateOne(
				{ calendarEventId: bodyObject.calendarEventId },
				setComment
			);
	} catch (error) {
		return { error: 'Failed to update comment' };
	}
}
