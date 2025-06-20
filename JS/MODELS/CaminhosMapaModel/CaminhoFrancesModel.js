let map;

	function initMap() {
	const origem = { lat: 43.1650, lng: -1.2356 }; // Saint-Jean-Pied-de-Port
	const destino = { lat: 42.8806, lng: -8.5449 }; // Catedral de Santiago

	const waypoints = [

		// Espanha - Navarra
		{ location: { lat: 43.0092, lng: -1.3195 }, stopover: true }, // Roncesvalles
		{ location: { lat: 42.8167, lng: -1.6500 }, stopover: true }, // Pamplona

		// Espanha - La Rioja
		{ location: { lat: 42.4650, lng: -2.4456 }, stopover: true }, // Logroño

		// Espanha - Castela e Leão
		{ location: { lat: 42.3500, lng: -3.7067 }, stopover: true }, // Burgos
		{ location: { lat: 42.6056, lng: -5.5700 }, stopover: true }, // León
		{ location: { lat: 42.4564, lng: -6.0536 }, stopover: true }, // Astorga
		{ location: { lat: 42.5466, lng: -6.5830 }, stopover: true }, // Ponferrada

		// Espanha - Galiza
		{ location: { lat: 42.7078, lng: -7.0436 }, stopover: true }, // O Cebreiro
		{ location: { lat: 42.7800, lng: -7.4100 }, stopover: true }, // Sarria
		{ location: { lat: 42.8110, lng: -7.6150 }, stopover: true }, // Portomarín
		{ location: { lat: 42.8730, lng: -7.8670 }, stopover: true }, // Palas de Rei
		{ location: { lat: 42.9310, lng: -8.1500 }, stopover: true }  // Arzúa
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
