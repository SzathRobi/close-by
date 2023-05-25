export interface StuffForIsochroneApi {
	latitude: any;
	longitude: any;
	mode: any;
	duration: any;
}

export const getIsochroneData = ({
	latitude,
	longitude,
	mode,
	duration
}: StuffForIsochroneApi) => {
	const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';

	return fetch(
		`${urlBase}${mode.toLowerCase()}/${longitude},${latitude}?contours_minutes=${duration}&polygons=true&denoise=1&access_token=${
			process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN
		}`
	).then((response) => response.json());
};
