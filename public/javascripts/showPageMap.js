mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: camp.geometry.coordinates, // [lng, lat] coordinates of the campground
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates) // Set marker location
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(`<h3>${camp.name}</h3><p>${camp.location}</p>`) // Update to use campground name and location
    )
    .addTo(map);
