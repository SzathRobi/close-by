'use client';

import { Inter } from '@next/font/google';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Fragment, useEffect, useState } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getEvents } from './utils/event';
import { EventData } from './interfaces/event-data.interface';
import EventCard from './components/events/event-card';
import Button from './components/shared/button/button';
import Modal from './components/shared/modal/modal';
import EventForm from './components/events/event-form';
import FeedbackSmall from './components/feedbacks/small/feedback-small';
import { RequestStatus } from './types/request-status.type';
import MapMarker from './components/map/map-marker/map-marker';
import MapPopup from './components/map/map-popup/map-popup';
import { MdLocationOn } from 'react-icons/md';
import { Location } from './interfaces/location.interface';
import { Contact } from './interfaces/contact.interface';
import ContactContaner from './components/contacts/contact-container/contact-contaner';
import Header from './components/header/header';
import MapUtility from './components/map/map-utility/map-utility';
import ModifyUserLocationForm from './components/forms/modify-user-location-form/modify-user-location-form';
import { FaArrowAltCircleDown, FaCheck, FaUser } from 'react-icons/fa';
import SearchInput from './components/shared/search-input/search-input';
import { Listbox, Transition } from '@headlessui/react';
import { RiArrowUpDownLine } from 'react-icons/ri';
import { Comment } from './interfaces/comment.interface';
import ContactMapMarker from './components/map/map-marker/contact-map-marker';
import ContactCard from './components/events/contact-card';
import { PhoneNumberInDb } from './interfaces/phone-number-in-db.interface';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const mapboxIsochroneUrlBase =
		'https://api.mapbox.com/isochrone/v1/mapbox/';
	const mapboxIsochroneProfile = 'driving-traffic';

	const { data: session, status }: any = useSession({
		required: true,
		onUnauthenticated() {
			signIn();
			// The user is not authenticated, handle it here.
		}
	});

	const [isMapUtilityOpen, setIsMapUtilityOpen] = useState<boolean>(true);
	const [clickedMarkerData, setClickMarkerData] = useState<
		EventData | Contact | null
	>(null);
	const [events, setEvents] = useState<EventData[]>([]);
	const [eventsBackup, setEventsBackup] = useState<EventData[]>([]);

	const [feedbackStatus, setFeedbackStatus] = useState<RequestStatus>('idle');
	const [feedbackText, setFeedbackText] = useState<string>('');

	const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>(
		undefined
	);

	const [isEventModalModalOpen, setIsEventModalOpen] =
		useState<boolean>(false);

	const [userLocation, setUserLocation] = useState<Location | null>(null);
	const [isochroneData, setIsochroneData] = useState<any>(null);
	const [distanceInMinute] = useState<number>(60);
	const [nearbyLocations, setNearbyLocations] = useState<EventData[] | null>(
		null
	);

	const [latitude, setLatitude] = useState<number>(47.5);
	const [longitude, setLongitude] = useState<number>(19);
	const [zoom, setZoom] = useState<number>(10);
	const [viewport, setViewport] = useState({
		latitude: 47.5,
		longitude: 19,
		zoom: 10
	});

	const [contacts, setContacts] = useState<Contact[]>([]);
	const [renderedContacts, setRenderedContacts] = useState<Contact[]>([]);
	const [isContactListOpen, setIsContactListOpen] = useState<boolean>(false);
	const [filterableContacts, setFilterableContacts] = useState<Contact[]>([]);

	const [commentsFromDb, setCommentsFromDb] = useState<Comment[]>([]);
	const [phonenumbersFromDb, setPhoneNumbersFromDb] = useState<
		PhoneNumberInDb[]
	>([]);

	const [searchInputValue, setSearchInputValue] = useState<string>('');

	const [shouldModifyUserLocation, setShouldModifyUserLocation] =
		useState<boolean>(false);

	const getEventType = (event: EventData): SelectOptions =>
		event?.colorId === '11'
			? 'Hívandó'
			: event?.colorId === '8'
			? 'Kérdőív'
			: 'Esemény';

	const onSearchEvent = async (event: any) => {
		event.preventDefault();

		const searchText: string = event.target.search.value;

		if (searchText.length === 0 && eventFilter !== 'Meglévő') {
			setEvents([...eventsBackup]);
			return;
		}

		let searchLocation: any;
		let hasError = false;

		if (eventFilter !== 'Meglévő') {
			try {
				const response = await fetch(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
				);
				const data = await response.json();

				searchLocation = {
					long: data.features[0].center[0],
					lat: data.features[0].center[1]
				};
			} catch (error) {
				hasError = true;
			}

			let filteredEvents = eventsBackup.filter(
				(eventData: EventData) =>
					eventData?.location
						?.toLocaleLowerCase()
						.includes(searchText.toLowerCase()) ||
					eventData?.summary
						?.toLocaleLowerCase()
						.includes(searchText.toLowerCase()) ||
					eventData?.description
						?.toLocaleLowerCase()
						.includes(searchText.toLowerCase())
			);

			if (eventFilter !== 'Összes') {
				filteredEvents = filteredEvents.filter(
					(eventData: EventData) =>
						getEventType(eventData) === eventFilter
				);
			}

			const eventsWithoutSearchedLoaction = eventsBackup.filter(
				(eventData: EventData) =>
					!eventData.location
						?.toLowerCase()
						.includes(searchText.toLowerCase())
			);

			const getNearbyLocations = hasError
				? []
				: eventsWithoutSearchedLoaction.filter((event: EventData) => {
						// centertől észak - nyugatra
						if (
							searchLocation &&
							event.coordinates &&
							searchLocation?.lat > event.coordinates?.lat &&
							searchLocation.long > event.coordinates?.long
						) {
							return (
								searchLocation.long - event.coordinates.long <
									0.65 &&
								searchLocation.lat - event.coordinates.lat <
									0.35
							);
						}

						// centertől észak - kelet
						if (
							searchLocation &&
							event.coordinates &&
							searchLocation?.lat < event.coordinates?.lat &&
							searchLocation.long > event.coordinates?.long
						) {
							return (
								searchLocation.long - event.coordinates.long <
									0.65 &&
								event.coordinates.lat - searchLocation.lat <
									0.35
							);
						}

						// centertől dél - kelet
						if (
							searchLocation &&
							event.coordinates &&
							searchLocation?.lat < event.coordinates?.lat &&
							searchLocation.long < event.coordinates?.long
						) {
							return (
								event.coordinates.long - searchLocation.long <
									0.65 &&
								event.coordinates.lat - searchLocation.lat <
									0.35
							);
						}

						// centertől dél - nyugat
						if (
							searchLocation &&
							event.coordinates &&
							searchLocation?.lat > event.coordinates?.lat &&
							searchLocation.long < event.coordinates?.long
						) {
							return (
								event.coordinates.long - searchLocation.long <
									0.65 &&
								searchLocation.lat - event.coordinates.lat <
									0.35
							);
						}
				  });

			setNearbyLocations(getNearbyLocations);

			setEvents(filteredEvents);
		} else {
			let filteredContacts = contacts.filter(
				(contact: Contact) =>
					contact?.location?.locationName
						?.toLocaleLowerCase()
						.includes(searchText.toLowerCase()) ||
					contact?.email
						?.toLocaleLowerCase()
						.includes(searchText.toLowerCase()) ||
					contact?.name
						?.toLocaleLowerCase()
						.includes(searchText.toLowerCase()) ||
					contact?.phoneNumber
						?.toLocaleLowerCase()
						.includes(searchText.toLowerCase())
			);

			setRenderedContacts(filteredContacts);
		}
	};

	const onSearchInputChange = (event: any) => {
		setSearchInputValue(event.target.value);

		if (event.target.value.length === 0) {
			setNearbyLocations(null);

			if (eventFilter === 'Összes') {
				setEvents(eventsBackup);
			} else if (eventFilter === 'Meglévő') {
				setRenderedContacts([...contacts]);
			} else {
				const filteredEvents = eventsBackup.filter(
					(eventData: EventData) =>
						getEventType(eventData) === eventFilter
				);
				setEvents(filteredEvents);
			}
		}
	};
	const getContactsInDb = async () => {
		const response = await fetch('/api/contacts');
		const data = await response.json();
		return data.contacts;
	};

	const getPhoneNumbersFromDb = async () => {
		const response = await fetch(`/api/phonenumber`);
		const data = await response.json();

		return data.phonenumbers;
	};

	const onMarkerOpen = (
		event: any,
		eventData?: EventData,
		clickFromCard?: boolean,
		contact?: Contact
	) => {
		if (!clickFromCard) {
			event.originalEvent.stopPropagation();
		}

		if (eventData) {
			setClickMarkerData(eventData);
			if (eventData.coordinates?.lat && eventData.coordinates?.long) {
				setLatitude(eventData.coordinates.lat);
				setLongitude(eventData.coordinates.long);
				setZoom(10);

				getIsochroneData(
					eventData.coordinates.lat,
					eventData.coordinates.long
				);
			}
			return;
		}

		if (contact) {
			setClickMarkerData(contact);
		}
	};

	const onMarkerClose = () => {
		setClickMarkerData(null);
	};

	const addNewEvent = (newEvent: EventData) => {
		const newEvents = [newEvent, ...events];

		setEvents(newEvents);
	};

	const updateSelectedEvent = (newEvent: EventData) => {
		const newEvents = events.map((event: EventData) =>
			event.id === newEvent.id ? newEvent : event
		);

		setEvents(newEvents);
	};

	const deleteCurrentEvent = (selectedEventId: string) => {
		const newEvents = events.filter(
			(event: EventData) => selectedEventId !== event.id
		);

		setEvents(newEvents);
	};

	const getUpcomingEvents = async (
		token: string,
		email: string
	): Promise<EventData[]> => {
		const currentEvents = await getEvents(token, email);

		const now = new Date(Date.now()).getTime();
		const dayInMiliseconds = 1000 * 60 * 60 * 24;

		const eventsOfPreviousThirdMonth = currentEvents.filter(
			(currentEvent: EventData) =>
				new Date(currentEvent.start.dateTime).getTime() <
				now + dayInMiliseconds
		);

		const eventsOfTwoWeeksFromNow = currentEvents.filter(
			(currentEvent: EventData) =>
				new Date(currentEvent.start.dateTime).getTime() >
				now + dayInMiliseconds
		);

		const filteredEventsOfTwoWeeksFromNow = eventsOfTwoWeeksFromNow.filter(
			(eventData: EventData) => eventData?.colorId === undefined
		);

		return [
			...filteredEventsOfTwoWeeksFromNow,
			...eventsOfPreviousThirdMonth
		].filter(
			(item: EventData) =>
				item.colorId !== '2' &&
				item.colorId !== '5' &&
				item.colorId !== '10'
		);
	};

	const getCommentsFromDb = async (currentEvent: EventData) => {
		const response = await fetch(
			`/api/comments/${currentEvent.calendarEventId}`
		);
		const data = await response.json();

		return data.comment;
	};

	const openModal = async (currentEvent?: EventData) => {
		if (currentEvent) {
			setSelectedEvent(currentEvent);

			getCommentsFromDb(currentEvent).then((data) => {
				setCommentsFromDb(data);
			});
		}

		setIsEventModalOpen(true);
	};

	const closeModal = () => {
		setIsEventModalOpen(false);
		setSelectedEvent(undefined);
		setCommentsFromDb([]);
	};

	const getIsochroneData = async (lat: number, long: number) => {
		const query = await fetch(
			`${mapboxIsochroneUrlBase}${mapboxIsochroneProfile}/${long},${lat}?contours_minutes=${distanceInMinute}&polygons=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`,
			{ method: 'GET' }
		);
		const data = await query.json();
		setIsochroneData(data);
	};

	const closeLocationModifyModal = (): void => {
		setShouldModifyUserLocation(false);
	};

	const onModifyUserLocationSubmit = async (event: any) => {
		event.preventDefault();

		const response = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.location.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
		);

		const data = await response.json();

		const newLocation: Location = {
			long: data.features[0].center[0],
			lat: data.features[0].center[1]
		};

		setUserLocation(newLocation);
		setLatitude(newLocation.lat);
		setLongitude(newLocation.long);
		closeLocationModifyModal();
	};

	const addContact = (contact: Contact) => {
		setContacts([contact, ...contacts]);
	};

	const updateContactName = (event: any, index: number) => {
		setContacts(
			contacts.map((contact: Contact, innerIndex: number) =>
				index === innerIndex
					? { ...contact, name: event.target.value }
					: contact
			)
		);
	};

	const updateContactPhoneNumber = (event: any, index: number) => {
		setContacts(
			contacts.map((contact: Contact, innerIndex: number) =>
				index === innerIndex
					? { ...contact, phoneNumber: event.target.value }
					: contact
			)
		);
	};

	const updateContactEmail = (event: any, index: number) => {
		setContacts(
			contacts.map((contact: Contact, innerIndex: number) =>
				index === innerIndex
					? { ...contact, email: event.target.value }
					: contact
			)
		);
	};

	const updateContactLocation = (event: any, index: number) => {
		setContacts(
			contacts.map((contact: Contact, innerIndex: number) =>
				index === innerIndex
					? {
							...contact,
							location: {
								...location,
								locationName: event.target.value
							}
					  }
					: contact
			)
		);
	};

	const deleteContactByIndex = async (contact: Contact, index: number) => {
		const res = await fetch(`/api/contacts/${contact.email}`, {
			method: 'DELETE'
		});

		const data = res.json();
		setContacts((oldConacts: Contact[]) => {
			return oldConacts.filter((_: Contact, i: number) => i !== index);
		});
	};

	const updateContactByIndex = async (
		contact: Contact,
		originalContact: Contact,
		index: number
	) => {
		const res = await fetch(`/api/contacts/${originalContact.email}`, {
			method: 'PUT',
			body: JSON.stringify(contact)
		});

		const data = await res.json();

		setContacts((oldConacts: Contact[]) => {
			return oldConacts.map((oldContact: Contact, i: number) =>
				i !== index ? oldContact : contact
			);
		});

		return data;
	};

	const closeContactModal = () => {
		setIsContactListOpen(false);
	};

	const openContactModal = () => {
		setIsContactListOpen(true);
	};

	const [isUpcomingEventsAreLoading, setIsUpcomingEventsAreLoading] =
		useState<boolean>(true);
	const [isPhoneNumbersFromDbAreLoading, setIsPhoneNumbersFromDbAreLoading] =
		useState<boolean>(true);

	useEffect(() => {
		if (session) {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(({ coords }) => {
					const { latitude, longitude } = coords;
					setUserLocation({ lat: latitude, long: longitude });
				});
			}

			getUpcomingEvents(session.accessToken, session.user.email)
				.then((currentEvents: EventData[]) => {
					setEvents(currentEvents);
					setEventsBackup(currentEvents);
					setIsUpcomingEventsAreLoading(false);
				})
				.catch(() => {
					signOut({ redirect: false, callbackUrl: '/auth/login' });
				});

			getContactsInDb().then((contacts) => {
				setContacts(contacts);
				setRenderedContacts(contacts);
				setFilterableContacts(contacts);
			});

			getPhoneNumbersFromDb().then((phoneNumbers) => {
				setPhoneNumbersFromDb(phoneNumbers);
				setIsPhoneNumbersFromDbAreLoading(false);
			});
		}
	}, [session]);

	useEffect(() => {
		if (eventsBackup.length > 0 && phonenumbersFromDb.length > 0) {
			const eventsBackupWithPhoneNumbers = eventsBackup.map(
				(eventData: EventData) => {
					const phoneNumberForEvent = phonenumbersFromDb.find(
						(phoneNumber: PhoneNumberInDb) =>
							phoneNumber.calendarEventId ===
							eventData.calendarEventId
					);

					if (phoneNumberForEvent) {
						return {
							...eventData,
							phoneNumber: phoneNumberForEvent
						};
					} else {
						return eventData;
					}
				}
			);

			setEvents(eventsBackupWithPhoneNumbers);
			setEventsBackup(eventsBackupWithPhoneNumbers);
		}
	}, [isUpcomingEventsAreLoading, isPhoneNumbersFromDbAreLoading]);

	useEffect(() => {
		if (userLocation) {
			getIsochroneData(userLocation?.lat, userLocation?.long);
		}
	}, [distanceInMinute, userLocation]);

	function isEventData(value: EventData | Contact): value is EventData {
		return (value as EventData).summary !== undefined;
	}

	useEffect(() => {
		if (clickedMarkerData && isEventData(clickedMarkerData)) {
			getCommentsFromDb(clickedMarkerData).then((data) => {
				setCommentsFromDb(data);
			});
		}
	}, [clickedMarkerData]);

	type SelectOptions =
		| 'Összes'
		| 'Esemény'
		| 'Hívandó'
		| 'Kérdőív'
		| 'Meglévő';

	const options: SelectOptions[] = [
		'Összes',
		'Esemény',
		'Hívandó',
		'Kérdőív',
		'Meglévő'
	];

	const [eventFilter, setEventFilter] = useState(options[0]);

	const updateEventFilter = () => {
		if (eventFilter === 'Összes') {
			setRenderedContacts([]);

			if (searchInputValue.length === 0) {
				setEvents([...eventsBackup]);
				return;
			}

			setEvents(
				eventsBackup.filter(
					(eventData: EventData) =>
						eventData?.location
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
						eventData?.summary
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
						eventData?.description
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase())
				)
			);

			return;
		}

		if (eventFilter === 'Esemény') {
			if (searchInputValue.length === 0) {
				setEvents([
					...eventsBackup.filter(
						(eventData: EventData) =>
							eventData?.colorId === undefined
					)
				]);
				return;
			}

			setEvents(
				eventsBackup.filter(
					(eventData: EventData) =>
						(eventData?.location
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
							eventData?.summary
								?.toLocaleLowerCase()
								.includes(
									searchInputValue.toLocaleLowerCase()
								) ||
							eventData?.description
								?.toLocaleLowerCase()
								.includes(
									searchInputValue.toLocaleLowerCase()
								)) &&
						eventData?.colorId === undefined
				)
			);

			return;
		}

		if (eventFilter === 'Kérdőív') {
			if (searchInputValue.length === 0) {
				setEvents([
					...eventsBackup.filter(
						(eventData: EventData) => eventData?.colorId === '8'
					)
				]);
				return;
			}

			setEvents(
				eventsBackup.filter(
					(eventData: EventData) =>
						(eventData?.location
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
							eventData?.summary
								?.toLocaleLowerCase()
								.includes(
									searchInputValue.toLocaleLowerCase()
								) ||
							eventData?.description
								?.toLocaleLowerCase()
								.includes(
									searchInputValue.toLocaleLowerCase()
								)) &&
						eventData?.colorId === '8'
				)
			);

			return;
		}

		if (eventFilter === 'Hívandó') {
			if (searchInputValue.length === 0) {
				setEvents([
					...eventsBackup.filter(
						(eventData: EventData) => eventData?.colorId === '11'
					)
				]);
				return;
			}

			setEvents(
				eventsBackup.filter(
					(eventData: EventData) =>
						(eventData?.location
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
							eventData?.summary
								?.toLocaleLowerCase()
								.includes(
									searchInputValue.toLocaleLowerCase()
								) ||
							eventData?.description
								?.toLocaleLowerCase()
								.includes(
									searchInputValue.toLocaleLowerCase()
								)) &&
						eventData?.colorId === '11'
				)
			);

			return;
		}

		if (eventFilter === 'Meglévő') {
			if (searchInputValue.length === 0) {
				setEvents([]);
				setRenderedContacts([...contacts]);
				return;
			}

			setEvents([]);
			setRenderedContacts(
				contacts.filter(
					(contact: Contact) =>
						contact?.location?.locationName
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
						contact?.email
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
						contact?.name
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase()) ||
						contact?.phoneNumber
							?.toLocaleLowerCase()
							.includes(searchInputValue.toLocaleLowerCase())
				)
			);

			return;
		}
	};

	const getTypeColor = (option: SelectOptions): string => {
		if (option === 'Esemény') {
			return 'bg-blue-400';
		}

		if (option === 'Hívandó') {
			return 'bg-red-400';
		}

		if (option === 'Kérdőív') {
			return 'bg-gray-400';
		}

		if (option === 'Meglévő') {
			return 'bg-purple-300';
		}

		return 'bg-blue-400';
	};

	useEffect(() => {
		updateEventFilter();
	}, [eventFilter]);

	return (
		<>
			<Header
				onContactsClick={openContactModal}
				onLogoutClick={() =>
					signOut({ redirect: false, callbackUrl: '/auth/login' })
				}
			/>
			<main className="relative bottom-24 flex flex-col-reverse items-start justify-center overflow-hidden lg:bottom-0 lg:h-screen lg:flex-row">
				<section className="mt-11 flex h-full w-full flex-col items-start gap-6 lg:w-[30%] lg:border lg:py-6 lg:pl-2">
					<div className="w-full">
						<SearchInput
							onSearchEvent={onSearchEvent}
							onSearchInputChange={onSearchInputChange}
						/>
						<div className="mb-8 w-full px-2">
							<Listbox
								value={eventFilter}
								onChange={setEventFilter}
							>
								<div className="relative mt-1">
									<Listbox.Button className="relative w-full cursor-default rounded-lg bg-blue-50 py-2 pl-3 pr-10 text-left shadow-md shadow-neutral-400 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:text-sm">
										<span className="block truncate">
											{eventFilter}
										</span>
										<span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-md bg-emerald-700 px-2">
											<RiArrowUpDownLine
												className="h-5 w-5 text-white"
												aria-hidden="true"
											/>
										</span>
									</Listbox.Button>
									<Transition
										as={Fragment}
										leave="transition ease-in duration-100"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
											{options.map((option, index) => (
												<Listbox.Option
													key={index}
													className={({ active }) =>
														`relative cursor-default select-none py-2 pl-10 pr-4 ${
															active
																? 'bg-emerald-100 text-emerald-900'
																: 'text-gray-900'
														}`
													}
													value={option}
												>
													{({ selected }) => (
														<>
															<span
																className={`block truncate ${
																	selected
																		? 'font-medium'
																		: 'font-normal'
																}`}
															>
																{option}
															</span>
															{index ===
															0 ? null : index ===
															  4 ? (
																<div className="absolute top-2.5 right-4 rounded">
																	<FaUser
																		size={
																			12
																		}
																	/>
																</div>
															) : (
																<div
																	className={`absolute top-2.5 right-4 h-4 w-4 rounded ${getTypeColor(
																		option
																	)}`}
																></div>
															)}
															{selected ? (
																<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
																	<FaCheck
																		className="h-5 w-5"
																		aria-hidden="true"
																	/>
																</span>
															) : null}
														</>
													)}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</Transition>
								</div>
							</Listbox>
						</div>
					</div>
					<Button
						className="ml-2"
						type="button"
						text="Esemény hozzáadása"
						onClick={() => openModal()}
					/>
					<div className="mb-6 h-full w-full overflow-y-scroll lg:mb-5 lg:pb-12">
						<div className=" p-2">
							{events.length > 0
								? events.map(
										(event: EventData, index: number) => (
											<EventCard
												key={index}
												eventData={event}
												searchValue={searchInputValue}
												onMarkerOpen={onMarkerOpen}
												onUpdateButtonClick={() =>
													openModal(event)
												}
											/>
										)
								  )
								: null}

							{eventFilter === 'Meglévő'
								? renderedContacts.map(
										(renderedContact: Contact) => (
											<ContactCard
												key={renderedContact.email}
												contact={renderedContact}
												onMarkerOpen={onMarkerOpen}
												searchValue={searchInputValue}
											/>
										)
								  )
								: null}

							{/* NEARBY LOCATIONS */}
							{nearbyLocations && eventFilter !== 'Meglévő' ? (
								<h4 className="mt-12 mb-16 rounded bg-gray-200 p-4 text-3xl font-semibold">
									Események a közelben
								</h4>
							) : null}
							{nearbyLocations
								? nearbyLocations.map(
										(
											location: EventData,
											index: number
										) => (
											<EventCard
												key={index}
												eventData={location}
												searchValue={searchInputValue}
												onMarkerOpen={onMarkerOpen}
												onUpdateButtonClick={() =>
													openModal(location)
												}
											/>
										)
								  )
								: null}
						</div>
					</div>
				</section>
				<section className="relative mt-11 h-screen w-full lg:w-[70%]">
					<button
						className="absolute top-28 right-4 z-10 rounded-full bg-emerald-600 shadow shadow-slate-600 md:hidden"
						onClick={() => {
							setIsMapUtilityOpen(true);
						}}
					>
						<FaArrowAltCircleDown size={24} color="#fff" />
					</button>
					<MapUtility
						isMapUtilityOpen={isMapUtilityOpen}
						setIsMapUtilityOpen={setIsMapUtilityOpen}
						setShouldModifyUserLocation={
							setShouldModifyUserLocation
						}
					/>
					<Map
						style={{ height: '100%' }}
						mapboxAccessToken={
							process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN
						}
						onMove={(viewport) => {
							setLongitude(viewport.viewState.longitude);
							setLatitude(viewport.viewState.latitude);
							setZoom(viewport.viewState.zoom);
						}}
						initialViewState={viewport}
						latitude={latitude}
						longitude={longitude}
						zoom={zoom}
						mapStyle="mapbox://styles/mapbox/streets-v9"
					>
						{userLocation && (
							<Marker
								anchor="bottom"
								longitude={userLocation.long}
								latitude={userLocation.lat}
							>
								<MdLocationOn
									size={40}
									style={{ color: 'crimson' }}
								/>
							</Marker>
						)}

						{isochroneData && (
							<Fragment>
								<Source
									id="asd"
									key="asd"
									type="geojson"
									data={isochroneData}
								>
									<Layer
										id="dsa"
										key="dsa"
										type="fill"
										source="asd"
										paint={{
											'fill-color': '#11ee11',
											'fill-opacity': 0.2
										}}
									/>
								</Source>
							</Fragment>
						)}

						{events &&
							events.map((event: EventData, index) =>
								event.coordinates?.lat ? (
									<MapMarker
										key={index}
										eventData={event}
										onClick={onMarkerOpen}
									/>
								) : null
							)}

						{nearbyLocations &&
							nearbyLocations
								.sort((a, b) =>
									a.location!.toLowerCase() >
									b.location!.toLowerCase()
										? 1
										: -1
								)
								.map((event: EventData, index) =>
									event.coordinates?.lat ? (
										<MapMarker
											key={index}
											eventData={event}
											onClick={onMarkerOpen}
										/>
									) : null
								)}

						{contacts.length &&
						(eventFilter === 'Meglévő' || eventFilter === 'Összes')
							? contacts.map((contact: Contact, index) =>
									contact.location?.coordinates?.latitude ? (
										<ContactMapMarker
											key={index}
											contact={contact}
											onClick={onMarkerOpen}
										/>
									) : null
							  )
							: null}

						{clickedMarkerData && (
							<MapPopup
								eventData={clickedMarkerData}
								onClose={onMarkerClose}
								onModifyEvent={openModal}
								commentsFromDb={commentsFromDb}
							/>
						)}
					</Map>
				</section>
			</main>

			{feedbackStatus === ('success' || 'error') && (
				<FeedbackSmall type="success" text={feedbackText} />
			)}
			{session ? (
				<Modal isOpen={isEventModalModalOpen} closeModal={closeModal}>
					<EventForm
						email={session.user.email}
						token={session.accessToken}
						selectedEvent={selectedEvent}
						feedbackStatus={feedbackStatus}
						addNewEvent={addNewEvent}
						updateSelectedEvent={updateSelectedEvent}
						deleteCurrentEvent={deleteCurrentEvent}
						setSelectedEvent={setSelectedEvent}
						setFeedbackStatus={setFeedbackStatus}
						closeModal={closeModal}
						setFeedbackText={setFeedbackText}
						contacts={contacts}
						filterableContacts={filterableContacts}
						commentsFromDb={commentsFromDb}
					/>
				</Modal>
			) : null}
			{session ? (
				<Modal
					isOpen={isContactListOpen}
					closeModal={closeContactModal}
				>
					<ContactContaner
						closeContactModal={closeContactModal}
						addContact={addContact}
						contacts={[...contacts]}
						deleteContactByIndex={deleteContactByIndex}
						updateContactByIndex={updateContactByIndex}
						updateContactEmail={updateContactEmail}
						updateContactLocation={updateContactLocation}
						updateContactName={updateContactName}
						updateContactPhoneNumber={updateContactPhoneNumber}
					/>
				</Modal>
			) : null}
			{session ? (
				<Modal
					isOpen={shouldModifyUserLocation}
					closeModal={closeLocationModifyModal}
				>
					<ModifyUserLocationForm
						onModifyUserLocationSubmit={onModifyUserLocationSubmit}
						closeLocationModifyModal={closeLocationModifyModal}
					/>
				</Modal>
			) : null}
		</>
	);
}
