//obter e guardar de localStorage que não temos servidor
let wordCounts = JSON.parse(localStorage.getItem('wordCounts')) || {};

function saveWords() {
	localStorage.setItem('wordCounts', JSON.stringify(wordCounts));
}

function addWord() {
	const input = document.getElementById('wordInput');
	const word = input.value.trim().toLowerCase();
	if (!word) return; //desistir se não houver palavra

	//incrementar numero de palavras
	wordCounts[word] = (wordCounts[word] || 0) + 1;

	//guardar, mostrar, e reiniciar
	saveWords();
	renderCloud();
	input.value = '';
}

function renderCloud() {
	const container = document.getElementById('wordCloud');
	container.innerHTML = '';

	const maxCount = Math.max(...Object.values(wordCounts), 1);

	for (let word in wordCounts) {
		const span = document.createElement('span');
		span.textContent = word;

		const size = 10 + (wordCounts[word] / maxCount) * 40; //de 10px a 50px
		span.style.fontSize = `${size}px`;

		container.appendChild(span);
	}
}

renderCloud();