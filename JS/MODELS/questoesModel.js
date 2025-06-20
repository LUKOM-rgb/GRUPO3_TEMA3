function loadFAQs() {
	const container = document.getElementById('faq-container');
	container.innerHTML = "";

	// JSON
	fetch('/JS/json/listaQuestoes.json')
		.then(response => response.json())
		.then(data => {
			data.forEach(faq => renderFAQ(faq));
			loadLocalFAQs();
		})
		.catch(error => {
			console.error('Erro ao carregar as FAQs:', error);
			loadLocalFAQs();
		});
}

function renderFAQ(faq) {
	const container = document.getElementById('faq-container');
	const question = document.createElement('h3');
	question.textContent = faq.question;

	const answer = document.createElement('p');
	answer.textContent = faq.answer && faq.answer.trim() !== "" ? faq.answer : "Aguardando resposta...";

	container.appendChild(question);
	container.appendChild(answer);
}

function addFAQ() {
	const questionInput = document.getElementById('user-question');
	const question = questionInput.value.trim();
	if (!question) {
		alert("Escreva uma pergunta válida.");
		return;
	}

	const newFAQ = { question, answer: "" };
	const localFAQs = JSON.parse(localStorage.getItem("userFAQs") || "[]");
	localFAQs.push(newFAQ);
	localStorage.setItem("userFAQs", JSON.stringify(localFAQs));
	renderFAQ(newFAQ);
	questionInput.value = "";
}

function loadLocalFAQs() {
	const localFAQs = JSON.parse(localStorage.getItem("userFAQs") || "[]");
	localFAQs.forEach(faq => renderFAQ(faq));
}

window.addEventListener('DOMContentLoaded', loadFAQs);
