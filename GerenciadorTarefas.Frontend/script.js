

const apiUrl = "http://localhost:5173/api/Tarefas";

async function carregarTarefas() {
    const response = await fetch(apiUrl);
    let tarefas = await response.json();

    const filtro = document.getElementById("filtroStatus")?.value;

    if (filtro !== "") {
        tarefas = tarefas.filter(t => t.status == filtro);
    }

    const lista = document.getElementById("listaTarefas");
    lista.innerHTML = "";

 tarefas.forEach(tarefa => {
    lista.innerHTML += `
        <li style="margin-bottom: 10px;">
            <input 
                type="text"
                id="titulo-${tarefa.id}"
                value="${tarefa.titulo}"
                disabled
            />

            <br>

            <textarea 
                id="descricao-${tarefa.id}"
                disabled
            >${tarefa.descricao ?? ""}</textarea>

            <br>

            <select id="status-${tarefa.id}" disabled>
                <option value="0" ${tarefa.status == 0 ? "selected" : ""}>Pendente</option>
                <option value="1" ${tarefa.status == 1 ? "selected" : ""}>Em Progresso</option>
                <option value="2" ${tarefa.status == 2 ? "selected" : ""}>Concluída</option>
            </select>

            <br>

            <button onclick="habilitarEdicao(${tarefa.id})">✏️ Editar</button>
            <button onclick="salvarEdicao(${tarefa.id})">💾 Salvar</button>
            <button onclick="deletarTarefa(${tarefa.id})">🗑 Excluir</button>
        </li>
    `;
});


}


async function criarTarefa() {
    const tituloInput = document.getElementById("titulo");
    const descricaoInput = document.getElementById("descricao");

    const titulo = tituloInput.value;
    const descricao = descricaoInput.value;

    if (!titulo) {
        alert("O título é obrigatório");
        return;
    }

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao })
    });

    tituloInput.value = "";
    descricaoInput.value = "";

    carregarTarefas();
}


async function concluirTarefa(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: "PUT"
    });

    carregarTarefas();
}

async function deletarTarefa(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    });

    carregarTarefas();
}

carregarTarefas();

function textoStatus(status) {
    switch (status) {
        case 0: return "Pendente";
        case 1: return "Em Progresso";
        case 2: return "Concluída";
        default: return "Desconhecido";
    }
}
function habilitarEdicao(id) {
    document.getElementById(`titulo-${id}`).disabled = false;
    document.getElementById(`descricao-${id}`).disabled = false;
    document.getElementById(`status-${id}`).disabled = false;
}

async function salvarEdicao(id) {
    const titulo = document.getElementById(`titulo-${id}`).value;
    const descricao = document.getElementById(`descricao-${id}`).value;
    const status = Number(document.getElementById(`status-${id}`).value);

    await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo,
            descricao,
            status
        })
    });

    carregarTarefas();
}
