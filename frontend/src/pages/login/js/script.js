const user_digitado = document.getElementById("user");
const password_digitado = document.getElementById("password");
const submit = document.getElementById("submit");

const access = async () => {
    if (user_digitado.value === 'teste1' && password_digitado.value === 'teste2') {
        sessionStorage.setItem('usuarioAutenticado', 'true');
        location.href = '/pages/main/index.html';
    } else {
        document.getElementById("status").innerHTML = `O Usuário <span class="status-user">${user.value}</span> ou senha não conferem`
    }
}