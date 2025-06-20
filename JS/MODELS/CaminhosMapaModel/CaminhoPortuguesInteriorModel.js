let map;

function initMap() {
	const origem = { lat: 40.6610, lng: -7.9097 }; // Viseu
	const destino = { lat: 42.8806, lng: -8.5449 }; // Santiago de Compostela

	const waypoints = [
		{ location: { lat: 40.8976, lng: -7.9362 }, stopover: true }, // Castro Daire
		{ location: { lat: 41.1007, lng: -7.8070 }, stopover: true }, // Lamego
		{ location: { lat: 41.1633, lng: -7.7863 }, stopover: true }, // Peso da Régua
		{ location: { lat: 41.3006, lng: -7.7458 }, stopover: true }, // Vila Real
		{ location: { lat: 41.7396, lng: -7.4694 }, stopover: true }, // Chaves
		{ location: { lat: 41.9410, lng: -7.4386 }, stopover: true }, // Verín
		{ location: { lat: 42.0634, lng: -7.7257 }, stopover: true }, // Xinzo de Limia
		{ location: { lat: 42.3352, lng: -7.8639 }, stopover: true }, // Ourense
		{ location: { lat: 42.4422, lng: -7.7079 }, stopover: true }, // Cea
		{ location: { lat: 42.5308, lng: -7.7502 }, stopover: true }, // Dozón
		{ location: { lat: 42.6991, lng: -8.2442 }, stopover: true }, // Silleda
		{ location: { lat: 42.6886, lng: -8.4893 }, stopover: true }, // A Estrada
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
