let map;

function initMap() {
	const origem = { lat: 38.7169, lng: -9.1399 }; // Lisboa
	const destino = { lat: 42.8806, lng: -8.5449 }; // Santiago de Compostela

	const waypoints = [
		// Portugal – Centro
		{ location: { lat: 39.2333, lng: -8.6833 }, stopover: true }, // Santarém
		{ location: { lat: 39.6036, lng: -8.4091 }, stopover: true }, // Tomar
		{ location: { lat: 40.2110, lng: -8.4292 }, stopover: true }, // Coimbra

		// Portugal – Norte
		{ location: { lat: 41.1496, lng: -8.6109 }, stopover: true }, // Porto
		{ location: { lat: 41.5388, lng: -8.6151 }, stopover: true }, // Barcelos
		{ location: { lat: 41.7679, lng: -8.5830 }, stopover: true }, // Ponte de Lima
		{ location: { lat: 42.0286, lng: -8.6455 }, stopover: true }, // Valença

		// Espanha – Galiza
		{ location: { lat: 42.0476, lng: -8.6445 }, stopover: true }, // Tui
		{ location: { lat: 42.1600, lng: -8.6231 }, stopover: true }, // O Porriño
		{ location: { lat: 42.2836, lng: -8.6099 }, stopover: true }, // Redondela
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
