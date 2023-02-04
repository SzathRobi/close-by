'use client';

import Image from 'next/image';
import { Inter } from '@next/font/google';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEvents } from './utils/event';
import { EventData } from './interfaces/event-data.interface';
import EventCard from './components/events/event-card';
import Button from './components/shared/button/button';
import Modal from './components/shared/modal/modal';
import EventForm from './components/events/event-form';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const { data: session }: any = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!session) {
			router.push('/auth/login');
			return;
		}
		getUpcomingEvents(session.accessToken, session.user.email).then(
			(currentEvents: EventData[]) => {
				setEvents(currentEvents);
			}
		);
	}, []);

	const [events, setEvents] = useState<EventData[]>([]);

	const getUpcomingEvents = async (
		token: string,
		email: string
	): Promise<EventData[]> => {
		const currentEvents = await getEvents(token, email);

		return currentEvents;
	};

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<main className="pt-4 pb-16">
				<button onClick={() => signOut()}>Kilépés</button>
				<section className="p-4 flex flex-col items-center gap-6">
					<Button
						type="button"
						text="Hozzáadás"
						onClick={() => openModal()}
					/>
					{events.length > 0 ? (
						events.map((event: EventData, index: number) => (
							<EventCard
								key={index}
								attendants={event.attendants}
								description={event.description}
								endDate={event.endDate}
								endTime={event.endTime}
								id={event.id}
								startDate={event.startDate}
								startTime={event.startTime}
								title={event.title}
							/>
						))
					) : (
						<p>üres</p>
					)}
				</section>
			</main>
			{session && (
				<Modal isOpen={isModalOpen} closeModal={closeModal}>
					<EventForm
						email={session.user.email}
						token={session.accessToken}
					/>
				</Modal>
			)}
		</>
	);
}
