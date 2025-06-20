document.addEventListener("DOMContentLoaded", function () {
	const user = JSON.parse(localStorage.getItem("utilizadorAtual"));

	if (user) return;
	const quizLink = document.getElementById("quiz-link");
	if (quizLink) quizLink.style.display = "none";
});