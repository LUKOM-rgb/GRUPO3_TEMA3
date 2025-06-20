let baseDeDados;
try {
  baseDeDados = JSON.parse(localStorage.getItem("baseDeDados"));
  if (!baseDeDados || !baseDeDados.utilizadores || !baseDeDados.caminhos) {
    baseDeDados = { caminhos: [], utilizadores: [] };
  }
} catch (e) {
  baseDeDados = { caminhos: [], utilizadores: [] };
}

window.addEventListener("DOMContentLoaded", () => {

  atualizarListaDeUtilizadores();
});

// Atualiza o localStorage
function salvarDados() {
  localStorage.setItem("baseDeDados", JSON.stringify(baseDeDados));
}

function atualizarListaDeUtilizadores() {
  const div = document.getElementById("listaUtilizadores");
  if (!div) return;

  let html = "<ul>";
  baseDeDados.utilizadores.forEach((user, index) => {
    html += `
      <li>
        <strong>${user.nome}</strong>
        <button onclick="removerUtilizador(${index})">Remover</button>
      </li>
    `;
  });
  html += "</ul>";
  div.innerHTML = html;
}

// Monitorização
function verPreferencias() {
  const output = document.getElementById("outputMonitorizacao");
  let html = "<h3>Preferências dos Utilizadores</h3><ul>";
  baseDeDados.utilizadores.forEach(user => {
    html += `<li><strong>${user.nome}</strong>: ${(user.preferencias || []).join(", ")}</li>`;
  });
  html += "</ul>";
  output.innerHTML = html;
}

function verNiveis() {
  const output = document.getElementById("outputMonitorizacao");
  const contagem = {};
  baseDeDados.utilizadores.forEach(user => {
    contagem[user.nivel || 1] = (contagem[user.nivel || 1] || 0) + 1;
  });
  let html = "<h3>Níveis</h3><ul>";
  for (const nivel in contagem) {
    html += `<li>Nível ${nivel}: ${contagem[nivel]} utilizador(es)</li>`;
  }
  html += "</ul>";
  output.innerHTML = html;
}
// Mostra todas as conquistas
function verBadges() {
	const output = document.getElementById("outputMonitorizacao");
	console.log(baseDeDados.utilizadores);
	console.log(JSON.parse(localStorage.getItem("utilizadorAtual")));
	const users = baseDeDados.utilizadores;

  if (users.length === 0) {
    output.innerHTML = "<p>Nenhum utilizador encontrado.</p>";
    return;
  }

  // Agrupa conquistas por tipo para estatísticas
  const stats = {};
  users.forEach(user => {
    (user.conquistas || []).forEach(c => {
      stats[c] = (stats[c] || 0) + 1;
    });
  });

  let html = `
    <div class="conquistas-header">
      <h3>Conquistas dos Utilizadores</h3>
      <div class="stats">Total: ${users.length} usuários</div>
    </div>
    <ul class="conquistas-list">
  `;

  users.forEach(user => {
    const conquistas = user.conquistas || [];
    html += `
      <li class="user-item">
        <div class="user-name">${user.nome}</div>
        <div class="user-badges">
          ${conquistas.length > 0
            ? conquistas.map(c => `
              <span class="badge" title="${c} (${stats[c]} usuários)">
                🏅 ${c}
              </span>
            `).join("")
            : "<span class='no-badges'>Sem conquistas</span>"}
        </div>
      </li>
    `;
  });

  html += "</ul>";
  output.innerHTML = html;
}


function verPercentagem() {
  const output = document.getElementById("outputMonitorizacao");
  const conquistasDisponiveis = [
    "Primeira Avaliação",
    "Crítico Persistente",
    "Crítico de Caminhos",
    "Caminho da Costa",
    "Caminho Finisterra",
    "Caminho Francês",
    "Caminho Ingles",
    "Caminho Madrid",
    "Caminho Portugues Central",
    "Caminho Portugues Interior",
    "Caminho Primitivo",
    "Caminho Viadela Plata"
  ];

  let totalConquistas = 0;
  let totalPossiveis = baseDeDados.utilizadores.length * conquistasDisponiveis.length;

  baseDeDados.utilizadores.forEach(user => {
    totalConquistas += (user.conquistas || []).length;
  });

  const percentagem = totalPossiveis > 0
    ? ((totalConquistas / totalPossiveis) * 100).toFixed(1)
    : "0";

  let html = "<h3>Percentagem de Conquistas</h3>";
  html += `<p>${percentagem}% das conquistas foram alcançadas (${totalConquistas} de ${totalPossiveis})</p>`;

  html += "<h4>Conquistas por Utilizador:</h4><ul>";
  baseDeDados.utilizadores.forEach(user => {
    const conquistas = (user.conquistas && user.conquistas.length > 0)
      ? user.conquistas.join(", ")
      : "Sem conquistas";
    html += `<li><strong>${user.nome}</strong>: ${conquistas}</li>`;
  });
  html += "</ul>";

  output.innerHTML = html;
}


// Atualizar dados em tempo real se outra aba modificar
window.addEventListener('storage', (event) => {
  if (event.key === 'baseDeDados') {
    try {
      const novaBaseDeDados = JSON.parse(event.newValue);
      if (novaBaseDeDados && novaBaseDeDados.utilizadores && novaBaseDeDados.caminhos) {
        baseDeDados = novaBaseDeDados;
        // Atualiza a visualização se estiver a monitorizar
        verPreferencias(); // ou outro painel ativo
      }
    } catch (e) {
      console.warn("Erro ao atualizar baseDeDados a partir da storage:", e);
    }
  }
});

function removerUtilizador(index) {
  if (confirm(`Tem a certeza que quer remover o utilizador "${baseDeDados.utilizadores[index].nome}"?`)) {
    baseDeDados.utilizadores.splice(index, 1);
    salvarDados();
    atualizarListaDeUtilizadores();
  }
}

    function criarNovoCaminhoInterativo() {
        const form = document.getElementById('form-caminho');
        const formData = new FormData(form);

        // Valida os dados
        if (!formData.get('nome') || !formData.get('etapas')) {
            alert('Nome e etapas são obrigatórios!');
            return;
        }

        // Processa as etapas
        const etapasArray = formData.get('etapas').split(',').map(e => e.trim()).filter(e => e);

        // Cria objeto do caminho
        const novoCaminho = {
            nome: formData.get('nome'),
            ritmo: formData.get('ritmo'),
            alojamento: [formData.get('alojamento')],
            orcamento: formData.get('orcamento'),
            sustentabilidade: [formData.get('sustentabilidade')],
            companhia: [formData.get('companhia')],
            objetivos: [formData.get('objetivos')],
            duracaoDias: parseInt(formData.get('duracaoDias')) || 0,
            etapas: etapasArray,
            localizacoes: {}
        };

        // Adiciona ao localStorage
        const caminhosExistentes = JSON.parse(localStorage.getItem('caminhosPersonalizados') || '[]');
        caminhosExistentes.push(novoCaminho);
        localStorage.setItem('caminhosPersonalizados', JSON.stringify(caminhosExistentes));

        alert('Caminho criado com sucesso!');
        form.reset();

        // Atualiza a lista de caminhos (se existir na página)
        if (typeof atualizarLista === 'function') {
            atualizarLista();
        }
    }
