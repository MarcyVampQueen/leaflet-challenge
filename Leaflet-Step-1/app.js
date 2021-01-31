// 4.5 last 7 days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Creating map object
var myMap = L.map("map", {
    center: [45.5051, -122.6750],
    zoom: 2
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


// Grab the data with d3
d3.json(url).then(function (data) {

    console.log(data);

    // Add 
    L.geoJson(data, {
        onEachFeature: popups,
        pointToLayer: circles
    }).addTo(myMap);

});

function popups(feature, layer) {
    layer.bindPopup('<h2>Magnitude: ' + feature.properties.mag + '</h2><hr><h4>Date: ' +
        new Date(feature.properties.time) + '</h4><h4>Location: ' +
        feature.properties.place + '</h4><p>' +
        feature.properties.url + '</p>');
}

function circles(feature, latlng) {
    var geojsonMarkerOptions = {
        radius: circleSize(feature.properties.mag),
        fillColor: colorIt(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

function circleSize(mag) {
    return mag > 7 ? 20 :
        mag > 5 ? 12 :
            mag > 2 ? 8 :
                2;
}
function colorIt(depth) {
    return depth > 700 ? '#800026' :
        depth > 500 ? '#BD0026' :
            depth > 300 ? '#E31A1C' :
                depth > 100 ? '#FC4E2A' :
                    depth > 70 ? '#FD8D3C' :
                        depth > 40 ? '#FEB24C' :
                            depth > 10 ? '#FED976' :
                                '#FFEDA0';
}
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 40, 70, 100, 300, 500, 700],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorIt(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);