let map;

	function initMap() {
	const origem = { lat: 40.4168, lng: -3.7038 }; // Madrid
	const destino = { lat: 42.8806, lng: -8.5449 }; // Santiago de Compostela

	const waypoints = [
		{ location: { lat: 40.6077, lng: -3.7116 }, stopover: true }, // Tres Cantos
		{ location: { lat: 40.7282, lng: -3.8647 }, stopover: true }, // Manzanares el Real
		{ location: { lat: 40.7431, lng: -4.0556 }, stopover: true }, // Cercedilla
		{ location: { lat: 40.9488, lng: -4.1184 }, stopover: true }, // Segovia
		{ location: { lat: 41.0953, lng: -4.5010 }, stopover: true }, // Santa María la Real de Nieva
		{ location: { lat: 41.2213, lng: -4.5195 }, stopover: true }, // Coca
		{ location: { lat: 41.3090, lng: -4.9177 }, stopover: true }, // Medina del Campo
		{ location: { lat: 41.5201, lng: -5.3927 }, stopover: true }, // Toro
		{ location: { lat: 41.5033, lng: -5.7464 }, stopover: true }, // Zamora
		{ location: { lat: 41.7373, lng: -5.9990 }, stopover: true }, // Granja de Moreruela
		{ location: { lat: 42.0023, lng: -5.6782 }, stopover: true }, // Benavente
		{ location: { lat: 42.4590, lng: -6.0570 }, stopover: true }, // Astorga
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
