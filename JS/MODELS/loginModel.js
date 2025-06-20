document.getElementById("entrar").addEventListener("click", () => {
  const baseDeDados = JSON.parse(localStorage.getItem("baseDeDados")) || { caminhos: [], utilizadores: [] };
  const users = baseDeDados.utilizadores;

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  //login como admin
  if (username === "admin" && password === "admin") {
    document.getElementById("login-message").innerText = "Entrando em Admin...";
    setTimeout(() => {
      window.location.href = "/html/admin.html";
    }, 1000);
    return;
  }

  //login como utilizador normal
  const user = users.find((user) => user.nome === username && user.password === password);
  if (user) {
    //atualiza o utilizadorAtual
    localStorage.setItem("utilizadorAtual", JSON.stringify(user));

    //garante que o utilizador existe na lista do localStorage (para conquistas)
    const usersStorage = JSON.parse(localStorage.getItem("utilizadores")) || [];
    if (!usersStorage.some(u => u.nome === user.nome)) {
      usersStorage.push({
        nome: user.nome,
        conquistas: user.conquistas || [] // Preserva conquistas existentes
      });
      localStorage.setItem("utilizadores", JSON.stringify(usersStorage));
    }

    document.getElementById("login-message").innerText = "Login bem-sucedido!";
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1000);
  } else {
    document.getElementById("login-message").innerText = "Credenciais inválidas.";
  }
});