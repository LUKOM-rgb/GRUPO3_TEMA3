let map;

function initMap() {
	const origem = { lat: 43.1111, lng: -9.2178 }; // Muxía
	const destino = { lat: 42.8806, lng: -8.5449 }; // Catedral de Santiago de Compostela

	const waypoints = [
		{ location: { lat: 42.9061, lng: -9.2644 }, stopover: true }, // Fisterra
		{ location: { lat: 42.9443, lng: -9.1880 }, stopover: true }, // Cee
		{ location: { lat: 42.9407, lng: -8.9747 }, stopover: true }, // Olveiroa
		{ location: { lat: 42.9097, lng: -8.7264 }, stopover: true }, // Negreira
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
