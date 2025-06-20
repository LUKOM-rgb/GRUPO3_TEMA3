let map;

function initMap() {
	const origem = { lat: 37.3886, lng: -5.9823 }; // Sevilha
	const destino = { lat: 42.8806, lng: -8.5449 }; // Catedral de Santiago de Compostela

	const waypoints = [
		{ location: { lat: 37.5419, lng: -6.0708 }, stopover: true }, // Guillena
		{ location: { lat: 38.4160, lng: -6.4173 }, stopover: true }, // Zafra
		{ location: { lat: 38.9161, lng: -6.3437 }, stopover: true }, // Mérida
		{ location: { lat: 39.4752, lng: -6.3720 }, stopover: true }, // Cáceres
		{ location: { lat: 40.9701, lng: -5.6635 }, stopover: true }, // Salamanca
		{ location: { lat: 41.5033, lng: -5.7446 }, stopover: true }, // Zamora
		{ location: { lat: 42.3364, lng: -7.8649 }, stopover: true }, // Ourense
	];

	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 7,
		center: origem,
		zoomControl: true,
		mapTypeControl: true,
		scaleControl: true,
		streetViewControl: true,
		rotateControl: true,
		fullscreenControl: true
	});

	const directionsService = new google.maps.DirectionsService();
	const directionsRenderer = new google.maps.DirectionsRenderer({
		suppressMarkers: true // para remover os marcadores automáticos com letras
	});
	directionsRenderer.setMap(map);

	const request = {
		origin: origem,
		destination: destino,
		waypoints: waypoints,
		optimizeWaypoints: true,
		travelMode: google.maps.TravelMode.WALKING
	};

	directionsService.route(request, function (response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
		directionsRenderer.setDirections(response);
		} else {
		alert("Erro ao gerar rota: " + status);
		}
	});

	const pontos = [origem, ...waypoints.map(w => w.location), destino];
	pontos.forEach((p, i) => {
		new google.maps.Marker({
		position: p,
		map: map,
		label: { text: (i + 1).toString(), color: "white", fontWeight: "bold" },
		title: `Etapa ${i + 1}`
		});
	});
}
