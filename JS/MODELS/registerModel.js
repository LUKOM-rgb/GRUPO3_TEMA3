document.getElementById("create-account").addEventListener("click", () => {
	let baseDeDados = JSON.parse(localStorage.getItem("baseDeDados")) || { caminhos: [], utilizadores: [] };

	const nome = document.getElementById("username").value.trim();
	const password = document.getElementById("password").value;
	const passwordRepeat = document.getElementById("passwordRepeat").value;

	if (!nome || !password) {
		document.getElementById("signup-message").innerText = "Preencha todos os campos.";
		return;
	}
	if (passwordRepeat !== password) {
		document.getElementById("signup-message").innerText = "As senhas não correspondem.";
		return;
	}

	if (baseDeDados.utilizadores.some(user => user.nome === nome)) {
		document.getElementById("signup-message").innerText = "Um utilizador com este nome já existe.";
		return;
	} else {
		//adiciona novo utilizador à baseDeDados.utilizadores com campos que o admin.js espera
		const novoUtilizador = new User(nome,password,[],1,[],[],[]);

		baseDeDados.utilizadores.push(novoUtilizador);
		localStorage.setItem("baseDeDados", JSON.stringify(baseDeDados));

		//guarda o utilizador atual
		localStorage.setItem("utilizadorAtual", JSON.stringify(novoUtilizador));
		document.getElementById("signup-message").innerText = "Conta criada com sucesso!";

		setTimeout(() => {
			window.location.href = "/index.html";
		}, 1000);
	}
});

class User {
	nome = "";
	password = "";
	preferencias = [];
	nivel = 1;
	badges = [];
	conquistas = [];
	caminhos = [];

	constructor(nome, password, preferencias = [], nivel = 1, badges = [], conquistas = [], caminhos = []) {
		this.nome = nome;
		this.password = password;
		this.preferencias = preferencias;
		this.nivel = nivel;
		this.badges = badges;
		this.conquistas = conquistas;
		this.caminhos = caminhos;
	}
}