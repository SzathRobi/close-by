'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import UserCard from './user-card';

const Login = () => {
	const { data: session }: any = useSession();

	if (session) {
		const getCalendars = async () => {
			const rawData = await fetch(
				'https://www.googleapis.com/calendar/v3/users/me/calendarList/szathrobi98@gmail.com',
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${session.accessToken}`
					}
				}
			);
			const data = await rawData.json();
		};

		const getEvents = async () => {
			const rawData = await fetch(
				'https://www.googleapis.com/calendar/v3/calendars/szathrobi98@gmail.com/events?' +
					new URLSearchParams({
						maxResults: '10',
						timeMin: new Date().toISOString(),
						showDeleted: 'false',
						singleEvents: 'true'
					}),
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${session.accessToken}`
					}
				}
			);
			const data = await rawData.json();
		};

		return (
			<div>
				<h1>You can go away</h1>
				<button
					type="button"
					onClick={() => signOut().then((stuff) => {})}
				>
					Sing out from google
				</button>
				<UserCard session={session} />
				<button
					className="bg-teal-700 text-white px-4 py-1"
					onClick={getCalendars}
				>
					Call Calendar
				</button>
				<button
					className="bg-teal-700 text-white px-4 py-1"
					onClick={getEvents}
				>
					Call Events
				</button>
			</div>
		);
	} else {
		return (
			<div>
				<h1>Check my stuff</h1>
				<button type="button" onClick={() => signIn()}>
					Sing in with google
				</button>
			</div>
		);
	}
};

export default Login;
