const submit = document.getElementById("submit");

const API_URL = "http:192.168.56.1:3000";

const access = async () => {
    await fetch(`${API_URL}/login`), {
        method: 'POST'
    }
}

const mudarCor = () => {
    document.querySelector(".enter>input").style.backgroundColor = "#FF0000";
}