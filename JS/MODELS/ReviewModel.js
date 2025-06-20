document.addEventListener('DOMContentLoaded', function() {
	// Obter o ID único do caminho sendo avaliado
	const reviewContainer = document.getElementById('review-container');
	const pageId = reviewContainer.getAttribute('data-page-id');

	// Elementos da página
	const loginMessage = document.getElementById('login-message');
	const submitButton = document.getElementById('submit-review');
	const commentTextarea = document.getElementById('review-comment');
	const stars = document.querySelectorAll('.star');
	const reviewsList = document.getElementById('reviews-list');

	// Verifica se há um usuário logado
	const currentUser = JSON.parse(localStorage.getItem('utilizadorAtual'));
	let selectedRating = 0;

	// Inicializa o sistema
	initReviewSystem();

	function initReviewSystem() {
		if (currentUser) {
			loginMessage.textContent = `Irá comentar como: ${currentUser.nome}`;
			loginMessage.style.color = "#2C8B57";
			checkReviewLimit();
		} else {
			loginMessage.textContent = "Você precisa de ter sessão iniciada para avaliar.";
			submitButton.disabled = true;
		}
		loadReviews();
	}


// procura no localStorage e mostra as avaliações para este caminho específico
	function loadReviews() {
		const allReviews = JSON.parse(localStorage.getItem('pageReviews')) || {};
		const currentPageReviews = allReviews[pageId] || [];

		reviewsList.innerHTML = '';

		if (currentPageReviews.length === 0) {
			reviewsList.innerHTML = '<p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>';
			return;
		}


		currentPageReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

		currentPageReviews.forEach(review => {
			const reviewElement = document.createElement('div');
			reviewElement.className = 'review-item';

			let starsHTML = '';
			for (let i = 0; i < 5; i++) {
				starsHTML += i < review.rating ? '★' : '☆';
			}

			reviewElement.innerHTML = `
				<div class="review-author">${review.userId}</div>
				<div class="review-date">${review.date}</div>
				<div class="review-stars">${starsHTML}</div>
				<div class="review-comment">${review.comment}</div>
			`;

			reviewsList.appendChild(reviewElement);
		});
	}
	//Impede que o utilizador avalie mais de 2 vezes o mesmo caminho
	function checkReviewLimit() {
	if (!currentUser) return;

	let allReviews = JSON.parse(localStorage.getItem('pageReviews')) || {};
	let currentPageReviews = allReviews[pageId] || [];

	const userReviews = currentPageReviews.filter(review => review.userId === currentUser.nome);

	if (userReviews.length >= 2) {
		submitButton.disabled = true;
		submitButton.textContent = "Limite de avaliações atingido";
	} else {
		submitButton.disabled = false;
		submitButton.textContent = "Enviar Avaliação";
	}
}


	stars.forEach(star => {
		star.addEventListener('click', () => {
			selectedRating = parseInt(star.getAttribute('data-value'));
			updateStars();
		});
		star.addEventListener('mouseover', () => {
			const hoverValue = parseInt(star.getAttribute('data-value'));
			stars.forEach((s, index) => {
				s.style.color = index < hoverValue ? '#ffcc00' : '#ccc';
			});
		});
		star.addEventListener('mouseout', () => {
			updateStars();
		});
	});
// mantem a estrela consistente com a avaliação selecionada
	function updateStars() {
		stars.forEach((star, index) => {
			star.style.color = index < selectedRating ? '#ffcc00' : '#ccc';
			star.classList.toggle('active', index < selectedRating);
		});
	}

	submitButton.addEventListener('click', () => {
		if (!currentUser) {
			alert('Por favor, faça login para avaliar.');
			return;
		}

		if (!selectedRating) {
			alert('Por favor, selecione uma classificação com estrelas.');
			return;
		}

		const comment = commentTextarea.value.trim();
		if (!comment) {
			alert('Por favor, escreva um comentário.');
			return;
		}

		let allReviews = JSON.parse(localStorage.getItem('pageReviews')) || {};
		let currentPageReviews = allReviews[pageId] || [];



		const newReview = {
			userId: currentUser.nome,
			rating: selectedRating,
			comment: comment,
			date: new Date().toLocaleDateString('pt-PT'),
			pageId: pageId
		};

		currentPageReviews.push(newReview);
		allReviews[pageId] = currentPageReviews;

		localStorage.setItem('pageReviews', JSON.stringify(allReviews));

		loadReviews();
		checkReviewLimit();
		commentTextarea.value = '';
		selectedRating = 0;
		updateStars();

		// Função conquistas
		addAchievementIfEarned(currentUser.nome, pageId);
	});
// Obtém os dados do utilizador
	function addAchievementIfEarned(userName, pageId) {
		let utilizadorAtual = JSON.parse(localStorage.getItem("utilizadorAtual"));
		let baseDeDados = JSON.parse(localStorage.getItem("baseDeDados")) || [];
		let utilizadores = baseDeDados.utilizadores;

		if (!utilizadorAtual) {
			console.warn("Utilizador não autenticado.");
			return;
		}

		if (!utilizadorAtual.conquistas) utilizadorAtual.conquistas = [];

		// Localizar utilizador na lista completa
		const index = utilizadores.findIndex(u => u.nome === utilizadorAtual.nome && u.password === utilizadorAtual.password);
		if (index === -1) {
			console.warn("Utilizador não encontrado em 'utilizadores'.");
			return;
		}

		// Garante que o utilizador da lista também tem array de conquistas
		if (!utilizadores[index].conquistas) utilizadores[index].conquistas = [];

		const allReviews = JSON.parse(localStorage.getItem('pageReviews')) || {};
		const currentPageReviews = allReviews[pageId] || [];
		const userReviews = currentPageReviews.filter(r => r.userId === userName);
		const total = userReviews.length;

		const unlock = (name, condition) => {
			console.log(name,condition);
			if (condition && !utilizadorAtual.conquistas.includes(name)) {
				//adiciona ao utilizadorAtual
				utilizadorAtual.conquistas.push(name);

				//adiciona ao utilizador na lista completa
				utilizadores[index].conquistas.push(name);

				//guarda alterações
				localStorage.setItem("utilizadorAtual", JSON.stringify(utilizadorAtual));
				localStorage.setItem("baseDeDados", JSON.stringify(baseDeDados));

				//mostra conquista
				showAchievement(name);
			}
		};

		unlock("Primeira Avaliação", total === 1);
		unlock("Crítico Persistente", total === 5);
		unlock("Crítico de Caminhos", total >= 17);
	}

	function showAchievement(title) {
		const msg = document.createElement('div');
		msg.textContent = `🏆 Conquista desbloqueada: ${title}`;
		msg.style.position = 'fixed';
		msg.style.bottom = '20px';
		msg.style.right = '20px';
		msg.style.background = '#2C8B57';
		msg.style.color = '#fff';
		msg.style.padding = '12px 18px';
		msg.style.borderRadius = '8px';
		msg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
		msg.style.zIndex = '9999';
		document.body.appendChild(msg);
		setTimeout(() => msg.remove(), 4000);
	}
});

