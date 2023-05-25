interface CoordinatesWithLocation {
	location: string;
	long: number;
	lat: number;
}

export const mapCoordinates = (coordinates: CoordinatesWithLocation) => {
	if (!coordinates.location) {
		return undefined;
	}

	return {
		lat: coordinates.lat,
		long: coordinates.long
	};
};
