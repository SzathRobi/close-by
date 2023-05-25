import { Source } from "mapbox-gl";

export interface StuffForThis {
	marker: any
}

  const renderIsochroneLayers = ({marker}: StuffForThis) => {
      const sourceId = `${marker.id}-geojson`;
      const layerId = `${marker.id}-layer`;

      return <Source>
  };