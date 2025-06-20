function loadPendingFAQs() {
	const container = document.getElementById('admin-faq-container');
	container.innerHTML = "";

	//ir buscar as perguntas feitas
	const faqs = JSON.parse(localStorage.getItem("userFAQs") || "[]");

	//para cada pergunta adicionar um ❓ e um ✅
	faqs.forEach((faq, index) => {
		const wrapper = document.createElement('div');
		wrapper.className = "faq-item";

		const q = document.createElement('p');
		q.textContent = "❓ " + faq.question;
		wrapper.appendChild(q);

		if (faq.answer && faq.answer.trim() !== "") {
			const a = document.createElement('p');
			a.textContent = "✅ " + faq.answer;
			wrapper.appendChild(a);
		} else {
			const input = document.createElement('textarea');
			input.placeholder = "Escreve uma resposta...";
			input.rows = 2;

			const btn = document.createElement('button');
			btn.textContent = "Responder";

			btn.onclick = () => {
				const resposta = input.value.trim();
				if (!resposta) {
					alert("Resposta não pode estar vazia.");
					return;
				}
				faqs[index].answer = resposta;
				localStorage.setItem("userFAQs", JSON.stringify(faqs));
				loadPendingFAQs();
			};

			wrapper.appendChild(input);
			wrapper.appendChild(btn);
		}

		container.appendChild(wrapper);
	});
}

window.addEventListener('DOMContentLoaded', loadPendingFAQs);