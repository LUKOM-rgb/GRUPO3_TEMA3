//isto faz com que o "login" e "registar" mudem para "Login como: nome" e "sair"
document.addEventListener('DOMContentLoaded', () => {
	const navBtns = document.querySelector('.nav-btns');
	const userDataJSON = localStorage.getItem('utilizadorAtual');

	if (!userDataJSON) return; //desistir se não houver sessão
	try {
		const user = JSON.parse(userDataJSON);
		if (user.nome) {
			navBtns.innerHTML = `
			<span style="color: black; font-weight: 600; margin-right: 10px; align-content: center;">
				Login como: ${user.nome}
			</span>
			<button id="logout-btn" style="background: #C24A4A; border:none; border-radius: 6px; padding: 8px 14px; cursor:pointer;">
				Sair
			</button>
			`;

			//sair remove o utilizador atual e recarrega a página
			document.getElementById('logout-btn').addEventListener('click', () => {
				localStorage.removeItem('utilizadorAtual');
				location.reload();
			});
		}
	} catch (e) {
		console.error('Erro ao ler utilizadorAtual do localStorage:', e);
	}
});
