// Função para mostrar conquistas do utilizador no UL com id "lista-conquistas"
function mostrarConquistas(userName) {
	const listaConquistas = document.getElementById("lista-conquistas");
	listaConquistas.innerHTML = "";

	//obter do utilizadorAtual
	let conquistasDoUtilizador = [];
	const userAtual = JSON.parse(localStorage.getItem("utilizadorAtual"));

	if (userAtual && (!userName || userAtual.nome === userName)) {
		conquistasDoUtilizador = userAtual.conquistas || [];
	} else { //se não encontrar, buscar na lista geral
		const users = JSON.parse(localStorage.getItem("utilizadores")) || [];
		const user = users.find(u => u.nome === userName);
		conquistasDoUtilizador = user?.conquistas || [];
	}

	//se não tiver conquistas
	if (conquistasDoUtilizador.length === 0) {
		listaConquistas.innerHTML = "<li>Sem conquistas ainda.</li>";
		return;
	}

	conquistasDoUtilizador.forEach(conquista => {
		const li = document.createElement("li");
		li.className = "conquista-item";
		li.innerHTML = `
		<span class="conquista-icone">🏅</span>
		<span class="conquista-texto">${conquista}</span>
		`;
		listaConquistas.appendChild(li);
	});

	const profileImage = document.querySelector(".imagem-perfil");
	//tirar todos primeiro
	profileImage.classList.remove("border-tier-1", "border-tier-2", "border-tier-3", "border-tier-4");

	//adicionar a que importa
	switch (true) {
		case (numBadges >= 10):
			profileImage.classList.add("border-tier-4");
			break;
		case (numBadges >= 6):
			profileImage.classList.add("border-tier-3");
			break;
		case (numBadges >= 3):
			profileImage.classList.add("border-tier-2");
			break;
		default:
			profileImage.classList.add("border-tier-1");
	}
}

// Função para mostrar caminhos com botão concluir
function mostrarCaminhos(caminhos) {
	const ul = document.getElementById("lista-caminhos");
	ul.innerHTML = "";
	caminhos.forEach(caminho => {
		const li = document.createElement("li");
		li.textContent = caminho;

		const btn = document.createElement("button");
		btn.textContent = "Concluir";
		btn.style.marginLeft = "10px";
		btn.onclick = () => concluirCaminho(caminho);

		li.appendChild(btn);
		ul.appendChild(li);
	});
}

// Concluir um caminho e ganhar a conquista associada
function concluirCaminho(caminho) {
	let utilizadorAtual = JSON.parse(localStorage.getItem("utilizadorAtual"));
	if (!utilizadorAtual) {
		alert("Nenhum utilizador autenticado.");
		return;
	}

	if (!utilizadorAtual.caminhos) utilizadorAtual.caminhos = [];
	if (!utilizadorAtual.caminhosConcluidos) utilizadorAtual.caminhosConcluidos = [];
	if (!utilizadorAtual.conquistas) utilizadorAtual.conquistas = [];

	// Verifica se o caminho está pendente
	if (!utilizadorAtual.caminhos.includes(caminho)) {
		alert(`O caminho "${caminho}" não está na sua lista de caminhos.`);
		return;
	}

	// Verifica se já foi concluído
	if (utilizadorAtual.caminhosConcluidos.includes(caminho)) {
		alert(`O caminho "${caminho}" já foi concluído.`);
		return;
	}

	// Mover para concluídos e remover de pendentes
	utilizadorAtual.caminhosConcluidos.push(caminho);
	utilizadorAtual.caminhos = utilizadorAtual.caminhos.filter(c => c !== caminho);

	// Criar conquista para este caminho
	const conquista = `Concluiu o caminho: ${caminho}`;
	if (!utilizadorAtual.conquistas.includes(conquista)) {
		utilizadorAtual.conquistas.push(conquista);

		let allAchievements = JSON.parse(localStorage.getItem("userAchievements")) || {};
		allAchievements[utilizadorAtual.nome] = utilizadorAtual.conquistas;
		localStorage.setItem("userAchievements", JSON.stringify(allAchievements));
	}

	// Atualiza localStorage
	localStorage.setItem("utilizadorAtual", JSON.stringify(utilizadorAtual));

	let baseDeDados = JSON.parse(localStorage.getItem("baseDeDados")) || { utilizadores: [] };
	const index = baseDeDados.utilizadores.findIndex(u => u.nome === utilizadorAtual.nome);
	if (index !== -1) {
		baseDeDados.utilizadores[index].caminhos = utilizadorAtual.caminhos;
		baseDeDados.utilizadores[index].caminhosConcluidos = utilizadorAtual.caminhosConcluidos;
		baseDeDados.utilizadores[index].conquistas = utilizadorAtual.conquistas;
		localStorage.setItem("baseDeDados", JSON.stringify(baseDeDados));
	}

	// Atualiza a interface
	mostrarCaminhos(utilizadorAtual.caminhos);
	mostrarConquistas(utilizadorAtual.nome);

	alert(`Parabéns! Concluiu o caminho "${caminho}" e ganhou uma conquista.`);
}

// Função para guardar as preferências selecionadas no formulário
function guardarTemas(event) {
	event.preventDefault();

	const checkboxes = document.querySelectorAll('input[name="temas"]:checked');
	const temasSelecionados = Array.from(checkboxes).map(cb => cb.value);

	let utilizadorAtual = JSON.parse(localStorage.getItem("utilizadorAtual"));
	if (!utilizadorAtual) {
		alert("Nenhum utilizador autenticado.");
		return;
	}

	utilizadorAtual.preferencias = temasSelecionados;

	let baseDeDados = JSON.parse(localStorage.getItem("baseDeDados")) || { utilizadores: [] };
	const index = baseDeDados.utilizadores.findIndex(u => u.nome === utilizadorAtual.nome);
	if (index !== -1) {
		baseDeDados.utilizadores[index].preferencias = temasSelecionados;
	}

	localStorage.setItem("utilizadorAtual", JSON.stringify(utilizadorAtual));
	localStorage.setItem("baseDeDados", JSON.stringify(baseDeDados));

	alert("Temas preferidos guardados: " + temasSelecionados.join(", "));
}

function logout() {
	localStorage.removeItem("utilizadorAtual");
	alert("Sessão fechada com sucesso.");
	window.location.href = "/html/login.html"; // Ajusta conforme necessário
}

// Carrega dados do utilizador ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
	const utilizadorAtual = JSON.parse(localStorage.getItem("utilizadorAtual"));
	if (!utilizadorAtual) {
		alert("Nenhum utilizador autenticado.");
		window.location.href = "/html/login.html";
		return;
	}

	document.querySelector(".nome").textContent = utilizadorAtual.nome || "Utilizador";
	document.querySelector(".nivel").textContent = "Nível: " + (utilizadorAtual.nivel || "1");

	// Mostra caminhos pendentes
	mostrarCaminhos(utilizadorAtual.caminhos || []);

	// Mostra preferências favoritas
	const preferenciasContainer = document.getElementById("lista-preferencias");
	preferenciasContainer.innerHTML = "";
	(utilizadorAtual.preferencias || []).forEach(pref => {
		const li = document.createElement("li");
		li.textContent = pref;
		li.classList.add("favorito");
		preferenciasContainer.appendChild(li);
	});

	// Marcar checkboxes dos temas já escolhidos
	document.querySelectorAll('input[name="temas"]').forEach(checkbox => {
		checkbox.checked = utilizadorAtual.preferencias?.includes(checkbox.value);
	});

	// Mostra conquistas
	mostrarConquistas(utilizadorAtual.nome);
});

window.guardarTemas = guardarTemas;
window.logout = logout;
window.concluirCaminho = concluirCaminho;

