let map;

	function initMap() {
	const origem = { lat: 43.4830, lng: -8.2369 }; // Ferrol
	const destino = { lat: 42.8806, lng: -8.5449 }; // Santiago de Compostela

	const waypoints = [
		{ location: { lat: 43.4933, lng: -8.1480 }, stopover: true }, // Neda
		{ location: { lat: 43.4076, lng: -8.1708 }, stopover: true }, // Pontedeume
		{ location: { lat: 43.2806, lng: -8.2146 }, stopover: true }, // Betanzos
		{ location: { lat: 43.1694, lng: -8.3397 }, stopover: true }, // Bruma
		{ location: { lat: 43.1366, lng: -8.4478 }, stopover: true }, // Sigüeiro
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
