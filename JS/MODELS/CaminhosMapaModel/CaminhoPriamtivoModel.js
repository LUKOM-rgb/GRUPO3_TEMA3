let map;

function initMap() {
	const origem = { lat: 43.3619, lng: -5.8494 }; // Oviedo
	const destino = { lat: 42.8806, lng: -8.5449 }; // Catedral de Santiago de Compostela

	const waypoints = [
		// Astúrias
		{ location: { lat: 43.4086, lng: -6.0681 }, stopover: true }, // Grado
		{ location: { lat: 43.3132, lng: -6.2610 }, stopover: true }, // Salas
		{ location: { lat: 43.3377, lng: -6.4155 }, stopover: true }, // Tineo
		{ location: { lat: 43.3123, lng: -6.5382 }, stopover: true }, // Pola de Allande
		{ location: { lat: 43.2442, lng: -6.6610 }, stopover: true }, // La Mesa
		{ location: { lat: 43.1960, lng: -6.8639 }, stopover: true }, // Grandas de Salime

		// Galiza
		{ location: { lat: 43.0896, lng: -7.1666 }, stopover: true }, // Fonsagrada
		{ location: { lat: 43.0505, lng: -7.2391 }, stopover: true }, // O Cádavo
		{ location: { lat: 43.0106, lng: -7.5560 }, stopover: true }, // Lugo
		{ location: { lat: 42.9323, lng: -7.6693 }, stopover: true }, // San Romao da Retorta
		{ location: { lat: 42.9131, lng: -7.8673 }, stopover: true }, // Melide
		{ location: { lat: 42.9323, lng: -8.1500 }, stopover: true }, // Arzúa
		{ location: { lat: 42.9041, lng: -8.3897 }, stopover: true }  // O Pedrouzo
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
