const user_digitado = document.getElementById("user");
const password_digitado = document.getElementById("password");
const submit = document.getElementById("submit");

const API_URL = "http:192.168.15.11:3000";

const access = async () => {
    await fetch(`${API_URL}/login`), {
        method: 'POST'
    }
}