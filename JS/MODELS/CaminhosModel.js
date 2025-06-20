//Lista dos países zonas e etapas
const dadosLocais = {
	Portugal: {
		Norte: ["Porto", "Barcelos", "Ponte de Lima", "Valença", "Vila do Conde", "Viana do Castelo","Caminha", "Vila Real", "Chaves"],
		Centro: ["Lisboa", "Santarém", "Tomar", "Coimbra", "Viseu", "Castro Daire", "Lamego", "Peso da Régua"]},
	Espanha: {
		Navarra: ["Roncesvalles","Pamplona"],
		La_Rioja: ["Logroño"],
		Castela_e_Leão: ["Burgos", "León", "Astorga", "Ponferrada", "Segovia", "Santa María la Real de Nieva", "Coca","Medina del Campo", "Toro", "Zamora", "Granja de Moreruela", "Benavente"],
		Galiza: ["O Cebreiro", "Sarria", "Portomarín", "Palas de Rei", "Arzúa", "Santiago de Compostela", "Tui","O Porriño", "Redondela", "Pontevedra", "Caldas de Reis", "Padrón", "Fonsagrada", "O Cádavo","Lugo", "San Romao da Retorta", "Melide", "O Pedrouzo", "A Estrada", "Cea", "Dozón", "Silleda","Xinzo de Limia", "Ourense", "Ferrol", "Neda", "Pontedeume", "Betanzos", "Bruma", "Sigüeiro","Muxía", "Fisterra", "Cee", "Olveiroa", "Negreira"],
		Astúrias: ["Oviedo", "Grado", "Salas", "Tineo", "Pola de Allande", "La Mesa", "Grandas de Salime"],
		Andaluzia: ["Sevilha", "Guillena"],
		Estremadura: ["Zafra", "Mérida", "Cáceres"],
		Comunidade_de_Madrid: ["Madrid", "Tres Cantos", "Manzanares el Real", "Cercedilla"]
	},
	França: {
		Aquitânia: ["Saint-Jean-Pied-de-Port"]
	}
};


//dependendo do país que escolhe da a zona desse pais e dependendo da zona que escolhe dá as etapas
document.getElementById("pais").addEventListener("change", function () {
	const zonas = dadosLocais[this.value] || {};
	const zonaSelect = document.getElementById("zona");
	const cidadeSelect = document.getElementById("cidade");

	zonaSelect.innerHTML = '<option value="">Escolhe uma zona</option>';
	cidadeSelect.innerHTML = '<option value="">Escolhe uma cidade/etapa</option>';

	for (let zona in zonas) {
		const opt = document.createElement("option");
		opt.value = zona;
		opt.textContent = zona;
		zonaSelect.appendChild(opt);
	}
});

document.getElementById("zona").addEventListener("change", function () {
	const paisSelecionado = document.getElementById("pais").value;
	const cidades = dadosLocais[paisSelecionado]?.[this.value] || [];
	const cidadeSelect = document.getElementById("cidade");

	cidadeSelect.innerHTML = '<option value="">Escolhe uma cidade/etapa</option>';
	cidades.forEach(cidade => {
		const opt = document.createElement("option");
		opt.value = cidade;
		opt.textContent = cidade;
		cidadeSelect.appendChild(opt);
	});
});

async function carregarCaminhos() {
	const resposta = await fetch('/JS/json/ListaCaminhosModel.json');
	return await resposta.json();
}
//dependendo do que o utilizador seleciona, vai associar pontos a cada opção,
// a de etapa inicial vale mais porque para nos é uma prioridade maior
function encontrarCaminhosRecomendados(preferencias, caminhosJson) {
	let melhorCaminhoPreferencias = null;
	let melhorCaminhoEtapa = null;
	let maiorPontuacaoPreferencias = -1;
	let maiorPontuacaoEtapa = -1;

	const pesos = {
		ritmo: 2,
		orcamento: 2,
		duracaoDias: 1,
		companhia: 1.5,
		alojamento: 1,
		sustentabilidade: 0.5,
		objetivos: 2,
		etapaInicio: 10
	};

	for (const caminho of caminhosJson) {
		let pontuacaoPreferencias = 0;
		let pontuacaoEtapa = 0;
		let contemEtapa = caminho.etapas.includes(preferencias.etapaInicio);

		if (caminho.ritmo === preferencias.ritmo) pontuacaoPreferencias += pesos.ritmo;
		if (caminho.orcamento === preferencias.orcamento) pontuacaoPreferencias += pesos.orcamento;
		if (caminho.duracaoDias <= preferencias.maxDias) pontuacaoPreferencias += pesos.duracaoDias;
		if (caminho.companhia.includes(preferencias.companhia)) pontuacaoPreferencias += pesos.companhia;

		if (contemEtapa) {
			pontuacaoEtapa = pontuacaoPreferencias;
			pontuacaoEtapa += pesos.etapaInicio;

			if (caminho.etapas[0] === preferencias.etapaInicio) {
				pontuacaoEtapa += pesos.etapaInicio * 0.5;
			}
		}

		if (pontuacaoPreferencias > maiorPontuacaoPreferencias) {
			maiorPontuacaoPreferencias = pontuacaoPreferencias;
			melhorCaminhoPreferencias = {
				...caminho,
				pontuacao: pontuacaoPreferencias,
				tipo: "preferencias"
			};
		}

		if (contemEtapa && pontuacaoEtapa > maiorPontuacaoEtapa) {
			maiorPontuacaoEtapa = pontuacaoEtapa;
			melhorCaminhoEtapa = {
				...caminho,
				pontuacao: pontuacaoEtapa,
				tipo: "etapa"
			};
		}
	}

	return {
		porPreferencias: melhorCaminhoPreferencias,
		porEtapa: melhorCaminhoEtapa
	};
}

//dependendo de cada fator, ordena os cards dos caminhos
function inicializarOrdenacao() {
	const cardsContainer = document.querySelector('.cards-container');
	const ordenarPor = document.getElementById('ordenar-por');

	if (ordenarPor) {
		ordenarPor.addEventListener('change', function() {
		ordenarCards(this.value, cardsContainer);
		});
	}
}

function ordenarCards(criterio, cardsContainer, cards) {
	const linksArray = Array.from(cardsContainer.querySelectorAll('a'));

	linksArray.sort((a, b) => {
		const cardA = extrairDadosCard(a.querySelector('.card'));
		const cardB = extrairDadosCard(b.querySelector('.card'));

		switch(criterio) {
		case 'etapas-asc':
			return parseInt(cardA.etapas) - parseInt(cardB.etapas);
		case 'etapas-desc':
			return parseInt(cardB.etapas) - parseInt(cardA.etapas);
		case 'duracao-asc':
			return parseInt(cardA.duracao) - parseInt(cardB.duracao);
		case 'duracao-desc':
			return parseInt(cardB.duracao) - parseInt(cardA.duracao);
		case 'rating-asc':
			return parseFloat(cardA.rating) - parseFloat(cardB.rating);
		case 'rating-desc':
			return parseFloat(cardB.rating) - parseFloat(cardA.rating);
		default:
			return 0;
		}
	});

	while (cardsContainer.firstChild) {cardsContainer.removeChild(cardsContainer.firstChild);}

	linksArray.forEach(link => {cardsContainer.appendChild(link);});
}

function extrairDadosCard(card) {
	const content = card.querySelector('.card-content');
	return {
		etapas: content.querySelector('.card-date').textContent.replace('Nº Etapas: ', ''),
		duracao: content.querySelector('.card-location').textContent.replace('Duração: ', '').replace(' Dias', ''),
		rating: content.querySelector('.card-rating').textContent.replace('⭐', '').trim()
	};
}

document.getElementById("form-preferencias").addEventListener("submit", async function(e) {
	e.preventDefault();

	const preferencias = {
		ritmo: this.ritmo.value,
		alojamento: this.alojamento.value,
		orcamento: this.orcamento.value,
		sustentabilidade: this.sustentabilidade.value,
		companhia: this.companhia.value,
		objetivos: this.objetivos.value,
		maxDias: parseInt(this.maxDias.value),
		etapaInicio: this.etapaInicio.value,
		pais: this.pais.value,
		zona: this.zona.value
	};

	const caminhos = await carregarCaminhos();
	const { porPreferencias, porEtapa } = encontrarCaminhosRecomendados(preferencias, caminhos);

	const resultadoEl = document.getElementById("resultado");
	const etapasDiv = document.getElementById("etapas");

	resultadoEl.innerHTML = "";
	etapasDiv.innerHTML = "";

	const exibirCaminho = (caminho, titulo) => {
		if (!caminho) return;

		const div = document.createElement("div");
		div.className = "caminho-recomendado";
		div.innerHTML = `
		<h2>${titulo}: ${caminho.nome}</h2>
		<p><strong>Duração:</strong> ${caminho.duracaoDias} dias</p>
		<p><strong>Etapas:</strong></p>
		<ol>
			${caminho.etapas.map(e =>
			`<li${e === preferencias.etapaInicio ? ' class="etapa-destaque"' : ''}>${e}</li> <br>`
			).join('')}
		</ol>
		`;
		resultadoEl.appendChild(div);
	};

	if (porPreferencias && porEtapa && porPreferencias.nome !== porEtapa.nome) {
		exibirCaminho(porPreferencias, "Melhor caminho pelas suas preferências");
		exibirCaminho(porEtapa, "Melhor caminho que passa por " + preferencias.etapaInicio);
	} else {
		exibirCaminho(porPreferencias || porEtapa, "Caminho recomendado");
	}
});

// começa a ordenação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarOrdenacao);

// rating

// IDs dos caminhos
const caminhosIds = {
  'Caminho da Costa': 'caminho_costa',
  'Caminho Francês': 'caminho_frances',
  'Caminho Português Central': 'caminho_portugues_central',
  'Caminho Primitivo': 'caminho_primitivo',
  'Caminho Português Interior': 'caminho_portgues_interior',
  'Caminho Inglês': 'caminho_ingles',
  'Caminho de Finisterra': 'caminho_finisterra',
  'Via de la Plata': 'caminho_via_plata',
  'Caminho de Madrid': 'caminho_madrid'
};


function inicializarRatingSystem() {

	const allReviews = JSON.parse(localStorage.getItem('pageReviews')) || {};

	// Atualiza o rating dos cards
	document.querySelectorAll('.card').forEach(card => {
		const titleElement = card.querySelector('.card-title');
		if (!titleElement) return;

		const caminhoNome = titleElement.textContent.trim();
		const caminhoId = caminhosIds[caminhoNome];
		const ratingElement = card.querySelector('.card-rating');

		if (caminhoId && ratingElement) {
			const reviews = allReviews[caminhoId] || [];

			if (reviews.length > 0) {
				const total = reviews.reduce((sum, review) => sum + review.rating, 0);
				const average = (total / reviews.length).toFixed(1);
				ratingElement.innerHTML = `${average} ⭐ (${reviews.length} avaliações)`;
			} else {
				ratingElement.innerHTML = 'Sem avaliações';
			}
		}
	});
}

// Função para ordenar por rating maior ou menor
function ordenarPorRating(cards, ordem = 'desc') {
	return cards.sort((a, b) => {
		const ratingA = parseFloat(a.dataset.rating || 0);
		const ratingB = parseFloat(b.dataset.rating || 0);
		return ordem === 'asc' ? ratingA - ratingB : ratingB - ratingA;
	});
}

// Atualiza a função de ordenação existente para incluir rating
function ordenarCards(criterio, cardsContainer) {
	const linksArray = Array.from(cardsContainer.querySelectorAll('a'));

	// Adiciona data-rating aos cards para ordenação
	linksArray.forEach(link => {
		const card = link.querySelector('.card');
		const ratingText = card.querySelector('.card-rating').textContent;
		const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
		card.dataset.rating = ratingMatch ? ratingMatch[0] : '0';
	});

	linksArray.sort((a, b) => {
		const cardA = a.querySelector('.card');
		const cardB = b.querySelector('.card');
		const dadosA = extrairDadosCard(cardA);
		const dadosB = extrairDadosCard(cardB);

		switch(criterio) {
		case 'etapas-asc': return parseInt(dadosA.etapas) - parseInt(dadosB.etapas);
		case 'etapas-desc': return parseInt(dadosB.etapas) - parseInt(dadosA.etapas);
		case 'duracao-asc': return parseInt(dadosA.duracao) - parseInt(dadosB.duracao);
		case 'duracao-desc': return parseInt(dadosB.duracao) - parseInt(dadosA.duracao);
		case 'rating-asc': return parseFloat(dadosA.rating) - parseFloat(dadosB.rating);
		case 'rating-desc': return parseFloat(dadosB.rating) - parseFloat(dadosA.rating);
		default: return 0; // Padrão mantém ordem original
		}
	});

	// Reorganiza os cards no container
	while (cardsContainer.firstChild) {
		cardsContainer.removeChild(cardsContainer.firstChild);
	}
	linksArray.forEach(link => cardsContainer.appendChild(link));
}

// Atualiza a função extrairDadosCard para incluir rating numérico
function extrairDadosCard(card) {
	const content = card.querySelector('.card-content');
	const ratingText = content.querySelector('.card-rating').textContent;
	const ratingMatch = ratingText.match(/(\d+\.?\d*)/);

	return {
		etapas: content.querySelector('.card-date').textContent.replace('Nº Etapas: ', ''),
		duracao: content.querySelector('.card-location').textContent.replace('Duração: ', '').replace(' Dias', ''),
		rating: ratingMatch ? parseFloat(ratingMatch[0]) : 0
	};
}


// INICIALIZAÇÃO //
document.addEventListener('DOMContentLoaded', function() {
	// Mante todas as inicializações existentes
	inicializarOrdenacao();

	// Adiciona a nova inicialização do sistema de ratings
	inicializarRatingSystem();

	// Atualiza o event listener
	document.getElementById("form-preferencias")?.addEventListener("submit", async function(e) {
		e.preventDefault();
	});
});