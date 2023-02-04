import { DefaultSession, Session, User } from 'next-auth';

const UserCard = ({ session }: { session: DefaultSession }) => {
	return (
		<div className="max-w-lg">
			<p>current Loggen in user</p>
			<h5>{session.user?.name}</h5>
			<p>{session.user?.email}</p>
			<pre className="max-w-md">{JSON.stringify(session, null, 2)}</pre>
		</div>
	);
};

export default UserCard;
