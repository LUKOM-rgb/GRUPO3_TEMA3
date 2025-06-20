let map;

function initMap() {
	const origem = { lat: 41.1496, lng: -8.6109 }; // Porto
	const destino = { lat: 42.8806, lng: -8.5449 }; // Santiago de Compostela

	const waypoints = [
		// Portugal – Norte (Litoral)
		{ location: { lat: 41.3528, lng: -8.7434 }, stopover: true }, // Vila do Conde
		{ location: { lat: 41.6918, lng: -8.8329 }, stopover: true }, // Viana do Castelo
		{ location: { lat: 41.8742, lng: -8.8389 }, stopover: true }, // Caminha

		// Espanha – Galiza
		{ location: { lat: 42.0326, lng: -8.6441 }, stopover: true }, // A Guarda
		{ location: { lat: 42.1167, lng: -8.8500 }, stopover: true }, // Oia
		{ location: { lat: 42.2167, lng: -8.8000 }, stopover: true }, // Baiona
		{ location: { lat: 42.2333, lng: -8.7167 }, stopover: true }, // Vigo
		{ location: { lat: 42.2836, lng: -8.6099 }, stopover: true }, // Redondela (junção com o caminho central)
		{ location: { lat: 42.4333, lng: -8.6447 }, stopover: true }, // Pontevedra
		{ location: { lat: 42.6036, lng: -8.6411 }, stopover: true }, // Caldas de Reis
		{ location: { lat: 42.7331, lng: -8.6602 }, stopover: true }  // Padrón
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
