if (sessionStorage.getItem('usuarioAutenticado') !== 'true') {
    alert("Você precisa fazer login para acessar esta página!");
    window.location.href = '/pages/login/index.html';
}

const pesquisado = document.getElementById("search").value;

const buscar = () => {
    return
}

const sair = () => {
    sessionStorage.removeItem('usuarioAutenticado');
    window.location.href = '/pages/login/index.html';
}