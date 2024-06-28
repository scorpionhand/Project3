let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
const citiApiUrl = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
d3.json(citiApiUrl).then(function (DataFromServer) {
	// Pull the "stations" property from response.data.
	// Initialize an array to hold the bike markers.
	let stationList = DataFromServer.data.stations;
	let myMap = createMap(stationList)
});
// Create the createMap function.
function createMap(stations = [{}]) {
	let stationMarkers = []
	// Loop through the stations array.
	stations.forEach(station => {
		let marker = createMarkers(station)
		// Add the marker to the bikeMarkers array.
		stationMarkers.push(marker)
	})
	// Create a layer group that's made from the bike markers array, and pass it to the createMap function.
	let markerLayerGroup = L.layerGroup(stationMarkers)

	// Create the tile layer that will be the background of our map.
	let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	})
	// Create a baseMaps object to hold the lightmap layer.
	let baseMaps = {
		"Steet Map": streetMap
	}

	// Create an overlayMaps object to hold the bikeStations layer.
	let overlayMaps = {
		"Bike Stations": markerLayerGroup
	}

	let myMap = L.map("map-id", {
		center: newYorkCoords,
		zoom: mapZoomLevel,
		layers: [streetMap, markerLayerGroup]
	});

	// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
	L.control.layers(baseMaps, overlayMaps).addTo(myMap)

	return myMap
}
// Create the createMarkers function.
function createMarkers(station = {}) {
	console.log(station)
	let popUpText = `<h1>${station.name}</h1><ul><li>${station.capacity}</li></ul>`
	// For each station, create a marker, and bind a popup with the station's name.
	var myIcon = L.icon({
		iconUrl: 'bike.png',
		iconSize: [38, 95],
	});

	let marker = L.marker([station.lat, station.lon], { icon: myIcon }).bindPopup(popUpText)
	return marker
}
