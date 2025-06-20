function timeAgo(unixTime) {
	const seconds = Math.floor(Date.now() / 1000) - unixTime;
	if (seconds < 60) return `Há ${seconds} segundos`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `Há ${minutes} minutos`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `Há ${hours} horas`;
	const days = Math.floor(hours / 24);
	return `Há ${days} dias`;
}

function generateUrlFromTitle(title) {
	return title
		.toLowerCase()
		.normalize("NFD").replace(/[\u0300-\u036f]/g, "") //remover acentos
		.replace(/[^a-z0-9 ]/g, '') //remover caracteres especiais
		.replace(/\s+/g, '-') + ".html"; //trocar espaços for - e por html no fim
}


function renderNews(data) {
	const container = document.getElementById("newsContainer");
	container.innerHTML = "";

	data.forEach(item => {
		const card = document.createElement("div");
		card.className = "news-card";

		card.innerHTML = `
			<a href="Noticias/${generateUrlFromTitle(item.title)}" class="news-link">
				<img src="${item.image}" alt="">
				<div class="news-content">
					<div class="news-meta">${item.category} | ${timeAgo(item.timestamp)}</div>
					<div class="news-title">${item.title}</div>
					<p>${item.description}</p>
				</div>
			</a>
		`;

		container.appendChild(card);
	});
}

fetch("/JS/json/ListaNoticiasModel.json").then(response => response.json()).then(data => renderNews(data)).catch(error => console.error("Erro ao carregar notícias:", error));