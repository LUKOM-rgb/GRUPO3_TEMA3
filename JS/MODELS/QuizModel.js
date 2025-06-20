function loadQuiz(jsonPath, quizTitle) {
    fetch(jsonPath)
    .then(response => response.json())
    .then(perguntas => {
        document.getElementById('quizTitle').textContent = quizTitle;

        const quizDiv = document.getElementById("quiz");
        quizDiv.innerHTML = '';

        perguntas.forEach((p, i) => {
            quizDiv.innerHTML += `<p><strong>${p.pergunta}</strong></p>`;
            p.opcoes.forEach(opcao => {
                quizDiv.innerHTML += `
                <label>
                <input type="radio" name="pergunta${i}" value="${opcao}">
                ${opcao}
                </label><br>`;
            });
        });

        document.getElementById("quizForm").addEventListener("submit", function(e) {
            e.preventDefault();
            let pontuacao = 0;

            perguntas.forEach((p, i) => {
                const resposta = document.querySelector(`input[name="pergunta${i}"]:checked`);
                if (resposta && resposta.value === p.correta) {
                    pontuacao++;
                }
            });
            console.log(pontuacao);

            const resultado = document.getElementById("resultado");
            if (pontuacao == perguntas.length) {
                resultado.innerHTML = `<h2>Parabéns! Respondeste corretamente a todas as perguntas.</h2>`;

                let utilizadorAtual = JSON.parse(localStorage.getItem("utilizadorAtual"));
                let baseDeDados = JSON.parse(localStorage.getItem("baseDeDados"));

                if (utilizadorAtual) {
                    if (!utilizadorAtual.conquistas) utilizadorAtual.conquistas = [];

                    const conquista = `${quizTitle} Completo!`;

                    //verifica se a conquista já existe no utilizadorAtual
                    if (!utilizadorAtual.conquistas.includes(conquista)) {
                        utilizadorAtual.conquistas.push(conquista);
                        localStorage.setItem("utilizadorAtual", JSON.stringify(utilizadorAtual));
                        console.log("Nova conquista adicionada:", conquista);

                        // Mostra a conquista desbloqueada
                        showAchievement(conquista);

                        //atualiza o utilizador correspondente em baseDeDados
                        if (baseDeDados && Array.isArray(baseDeDados.utilizadores)) {
                            const indiceUtilizador = baseDeDados.utilizadores.findIndex(
                                user =>
                                user.nome === utilizadorAtual.nome &&
                                user.password === utilizadorAtual.password
                            );

                            if (indiceUtilizador !== -1) {
                                const utilizadorBD = baseDeDados.utilizadores[indiceUtilizador];
                                if (!utilizadorBD.conquistas) utilizadorBD.conquistas = [];
                                if (!utilizadorBD.conquistas.includes(conquista)) {
                                    utilizadorBD.conquistas.push(conquista);
                                }

                                localStorage.setItem("baseDeDados", JSON.stringify(baseDeDados));
                            } else {
                                console.warn("Utilizador não encontrado em baseDeDados.");
                            }
                        } else {
                            console.warn("baseDeDados inválida ou não encontrado.");
                        }
                    }
                } else {
                    console.warn("Utilizador não autenticado. Conquista não foi salva.");
                }

            } else {
                resultado.innerHTML = `<h2>Acertaste ${pontuacao} de ${perguntas.length} perguntas.</h2>`;
            }
        });
    })
    .catch(error => {
        console.error("Erro ao carregar quiz:", error);
        document.getElementById("quiz").innerHTML = "<p>Erro ao carregar o quiz.</p>";
    });
}

// Função para mostrar conquista desbloqueada
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
    msg.style.animation = 'slideIn 0.5s ease-out';

    // Adiciona animação de fade out antes de remover
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.transition = 'opacity 1s';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 1000);
    }, 3000);
}

// Adiciona os estilos de animação dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);