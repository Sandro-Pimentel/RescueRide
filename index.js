const btnEntrar = document.querySelector("#entrar");
const btnSalvar = document.querySelector("#salvar");
let emailAtual = localStorage.getItem('emailAtual') || '';
let idAtual = localStorage.getItem('idAtual') || 0;
const pag = document.title;

const salva = async (e) => {
    e.preventDefault()
    const nome = document.querySelector("#perfilNome");
    const email = document.querySelector("#perfilEmail");
    const telefone = document.querySelector("#perfilTelefone");
    const modelo = document.querySelector("#perfilModelo");
    const placa = document.querySelector("#perfilPlaca");

    if(!nome.value || !email.value || !telefone.value || !modelo.value || !placa.value) {
        alert("Preencha todos os campos!")
        return
    }

    const userId = await buscaId(emailAtual);
    if(!userId) {
        alert("Usuário não encontrado")
        return
    }

    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome.value,
                email: email.value,
                telefone: telefone.value,
                modelo: modelo.value,
                placa: placa.value
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || 'Usuário atualizado com sucesso');
        } else {
            alert(result.message || 'Erro ao atualizar usuário');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
        console.error(error);
    }
}


const login = async (e) => {
    e.preventDefault()
    const email = document.querySelector("#email");
    const senha = document.querySelector("#senha");

    if(!email.value || !senha.value) {
        alert("Preencha todos os campos!")
        return
    }

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                senha: senha.value
            }),
        });

        const result = await response.json();

        if(response.ok) {
            emailAtual = email.value;
            idAtual = await buscaId(email.value);
           
            localStorage.setItem('emailAtual', emailAtual);
            localStorage.setItem('idAtual', idAtual);

            alert(result.message || 'Usuário conectado com sucesso');
            window.location.href = './pages/home.html';
        } else {
            alert(result.message || 'Erro ao atualizar usuário');
        }
    } catch(e) {
        alert('Erro ao conectar com o servidor');
        console.error(e);
    }
}

const buscaId = async (email) => {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/getone?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    
        const result = await response.json();

        if(response.ok) {
            return result.id
        } else {
            alert(result.message || 'Erro ao buscar usuário');
            return null
        }
    } catch(e) {
        alert('Erro ao conectar com o servidor');
        console.error(e);
        return null
    }
}

const buscaPorId = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/getbyid?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        const result = await response.json();

        if(response.ok) {
            return result;
        } else {
            alert(result.message || 'Erro ao atualizar usuário');
            return null
        }
    } catch(e) {
        alert('Erro ao conectar com o servidor');
        console.error(e);
        return null
    }
}

if(pag == "Meu Perfil - RescueRide") {
    (async () => {
        const nome = document.querySelector("#perfilNome");
        const email = document.querySelector("#perfilEmail");
        const telefone = document.querySelector("#perfilTelefone");
        const modelo = document.querySelector("#perfilModelo");
        const placa = document.querySelector("#perfilPlaca");
    
        const resposta = await buscaPorId(idAtual);
        if(resposta) {
            nome.placeholder = resposta.nome
            email.placeholder = resposta.email
            telefone.placeholder = resposta.telefone
            modelo.placeholder = resposta.modelo
            placa.placeholder = resposta.placa
        }
    })();
}

if(pag == "Login - RescueRide") {
    localStorage.setItem('emailAtual', '')
    localStorage.setItem('idAtual', 0)
}

btnEntrar?.addEventListener("click", login)
btnSalvar?.addEventListener("click", salva)