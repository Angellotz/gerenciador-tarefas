const API_BASE_URL = 'http://localhost:5173';
const API_ENDPOINT = '/api/Tarefas';

const STATUS = {
    0: { text: 'Pendente', class: 'pendente', action: 'Pendente' },
    1: { text: 'Em Progresso', class: 'em-progresso', action: 'Em Progresso' },
    2: { text: 'Concluída', class: 'concluida', action: 'Concluída' }
};

function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        if (response.status === 204) {
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagem(`Erro: ${error.message}`, 'erro');
        throw error;
    }
}

function mostrarMensagem(texto, tipo = 'sucesso') {
    const cores = {
        sucesso: '#196cbbff',
        erro: '#bd1010d2',
        aviso: '#f8961e'
    };
    
    const mensagem = document.createElement('div');
    mensagem.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${cores[tipo] || '#4361ee'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    mensagem.textContent = texto;
    document.body.appendChild(mensagem);
    
    setTimeout(() => {
        mensagem.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => mensagem.remove(), 300);
    }, 3000);
}

const estiloAnimacao = document.createElement('style');
estiloAnimacao.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(estiloAnimacao);

document.addEventListener('DOMContentLoaded', function() {
    carregarTarefas();
    
    // Permitir adicionar tarefa pressionando Enter 
    document.getElementById('titulo').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            criarTarefa();
        }
    });
});

async function getTarefas() {
    try {
        const tarefas = await fetchAPI(`${API_BASE_URL}${API_ENDPOINT}`);
        return tarefas;
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        return [];
    }
}

async function criarTarefa() {
    const titulo = document.getElementById('titulo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const status = document.getElementById('status').value;
    
    if (!titulo) {
        mostrarMensagem('Por favor, insira um título para a tarefa.', 'aviso');
        return;
    }
    
    try {
        const novaTarefa = {
            titulo: titulo,
            descricao: descricao,
            status: parseInt(status)
            
        };
        
        await fetchAPI(`${API_BASE_URL}${API_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify(novaTarefa)
        });
        
        document.getElementById('titulo').value = '';
        document.getElementById('descricao').value = '';
        document.getElementById('status').value = '0';
        
        await carregarTarefas();
        
        mostrarMensagem('Tarefa criada com sucesso!', 'sucesso');
        
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
    }
}

async function carregarTarefas() {
    const filtroStatus = document.getElementById('filtroStatus').value;
    const ordenarPor = document.getElementById('ordenarTarefas').value;
    const listaTarefas = document.getElementById('listaTarefas');
    
    // Mostrar loading
    listaTarefas.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Carregando tarefas...</p></div>';
    
    try {
        let tarefas = await getTarefas();
        
        if (filtroStatus !== '') {
            tarefas = tarefas.filter(tarefa => tarefa.status === parseInt(filtroStatus));
        }
        
        tarefas.sort((a, b) => {
            if (ordenarPor === 'status') {
                return a.status - b.status;
            } else if (ordenarPor === 'titulo') {
                return a.titulo.localeCompare(b.titulo);
            } else if (ordenarPor === 'data') {

                return new Date(b.dataCriacao) - new Date(a.dataCriacao);
            } else {
                return (b.id || 0) - (a.id || 0);
            }
        });
        
        listaTarefas.innerHTML = '';
        
        if (tarefas.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <h3>Nenhuma tarefa encontrada</h3>
                <p>${filtroStatus === '' ? 'Adicione sua primeira tarefa usando o formulário ao lado!' : 'Não há tarefas com esse status.'}</p>
            `;
            listaTarefas.appendChild(emptyState);
            atualizarEstatisticas(tarefas);
            return;
        }
        
        tarefas.forEach(tarefa => {
            const statusInfo = STATUS[tarefa.status] || STATUS[0];
            
            const li = document.createElement('li');
            li.className = `task-item ${statusInfo.class}`;
            li.innerHTML = `
                <div class="task-content">
                    <div class="task-title">${tarefa.titulo}</div>
                    <div class="task-desc">${tarefa.descricao || 'Sem descrição'}</div>
                    <div class="task-meta">
                    <div class="data-item">Criada em: ${formatarData(tarefa.dataCriacao)}</div>
                    ${tarefa.dataConclusao ? `<div class="data-item">Concluída em: ${formatarData(tarefa.dataConclusao)}</div>` : ''}
                </div>
                </div>
                <div class="task-actions">
                    <span class="task-status status-${statusInfo.class}">${statusInfo.text}</span>
                    <div>
                        ${tarefa.status !== 2 ? `
                            <button class="action-btn btn-complete" onclick="alterarStatus(${tarefa.id}, 2)" title="Marcar como concluída">
                                <i class="fas fa-check-circle"></i>
                            </button>
                        ` : ''}
                        ${tarefa.status !== 1 ? `
                            <button class="action-btn btn-progress" onclick="alterarStatus(${tarefa.id}, 1)" title="Marcar como em progresso">
                                <i class="fas fa-spinner"></i>
                            </button>
                        ` : ''}
                        ${tarefa.status !== 0 ? `
                            <button class="action-btn btn-pendente" onclick="alterarStatus(${tarefa.id}, 0)" title="Marcar como pendente">
                                <i class="fas fa-clock"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn btn-edit" onclick="editarTarefa(${tarefa.id})" title="Editar tarefa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn btn-delete" onclick="excluirTarefa(${tarefa.id})" title="Excluir tarefa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            listaTarefas.appendChild(li);
        });
        
        atualizarEstatisticas(tarefas);
        
    } catch (error) {
        listaTarefas.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro ao carregar tarefas</h3>
                <p>Ocorreu um erro ao buscar as tarefas. Verifique sua conexão e tente novamente.</p>
                <button onclick="carregarTarefas()" class="btn" style="margin-top: 15px;">
                    <i class="fas fa-redo"></i> Tentar novamente
                </button>
            </div>
        `;
    }
}

async function atualizarEstatisticas(tarefas) {
    if (!tarefas) {
        tarefas = await getTarefas().catch(() => []);
    }
    
    const total = tarefas.length;
    const pendentes = tarefas.filter(t => t.status === 0).length;
    const emProgresso = tarefas.filter(t => t.status === 1).length;
    const concluidas = tarefas.filter(t => t.status === 2).length;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('pending-tasks').textContent = pendentes;
    document.getElementById('progress-tasks').textContent = emProgresso;
    document.getElementById('completed-tasks').textContent = concluidas;
}

async function alterarStatus(id, novoStatus) {
    try {
        const tarefaAtual = await fetchAPI(`${API_BASE_URL}${API_ENDPOINT}/${id}`);
        
        if (!tarefaAtual) {
            mostrarMensagem('Tarefa não encontrada', 'erro');
            return;
        }
        
        const tarefaAtualizada = {
            id: id,
            titulo: tarefaAtual.titulo,
            descricao: tarefaAtual.descricao,
            status: novoStatus,
            dataCriacao: tarefaAtual.dataCriacao,
            dataConclusao: novoStatus === 2 ? new Date().toISOString() : null
        };
        
        await fetchAPI(`${API_BASE_URL}${API_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tarefaAtualizada)
        });
        
        await carregarTarefas();
        mostrarMensagem(`Tarefa marcada como ${STATUS[novoStatus].text.toLowerCase()}!`, 'sucesso');
        
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        mostrarMensagem('Erro ao atualizar status', 'erro');
    }
}

async function buscarTarefa(id) {
    try {
        return await fetchAPI(`${API_BASE_URL}${API_ENDPOINT}/${id}`);
    } catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        return null;
    }
}

async function editarTarefa(id) {
    try {
        const tarefa = await buscarTarefa(id);
        
        if (tarefa) {
            document.getElementById('titulo').value = tarefa.titulo;
            document.getElementById('descricao').value = tarefa.descricao || '';
            document.getElementById('status').value = tarefa.status;
            
            const btnAdicionar = document.querySelector('.btn');
            btnAdicionar.innerHTML = '<i class="fas fa-save"></i> Salvar Edição';
            btnAdicionar.style.backgroundColor = 'var(--warning-color)';
            
            btnAdicionar.setAttribute('onclick', `salvarEdicao(${id})`);
            
            mostrarMensagem('Preencha os campos e clique em "Salvar Edição"', 'aviso');
        }
    } catch (error) {
        console.error('Erro ao carregar tarefa para edição:', error);
    }
}

async function salvarEdicao(id) {
    const titulo = document.getElementById('titulo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const status = document.getElementById('status').value;
    
    if (!titulo) {
        mostrarMensagem('Por favor, insira um título para a tarefa.', 'aviso');
        return;
    }
    
    try {
        
        const tarefaAtual = await buscarTarefa(id);
        if (!tarefaAtual) {
            mostrarMensagem('Tarefa não encontrada!', 'erro');
            return;
        }
        
        const tarefaAtualizada = {
            id: id,
            titulo: titulo,
            descricao: descricao,
            status: parseInt(status),
            dataCriacao: tarefaAtual.dataCriacao,
            dataConclusao: status === '2' ? (tarefaAtual.dataConclusao || new Date().toISOString()) : null
        };
        
        await fetchAPI(`${API_BASE_URL}${API_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tarefaAtualizada)
        });
        
        document.getElementById('titulo').value = '';
        document.getElementById('descricao').value = '';
        document.getElementById('status').value = '0';
        
        // Resetar botão 
        const btnAdicionar = document.querySelector('.btn');
        btnAdicionar.innerHTML = '<i class="fas fa-plus"></i> Adicionar Tarefa';
        btnAdicionar.style.backgroundColor = '';
        btnAdicionar.setAttribute('onclick', 'criarTarefa()');
        
        await carregarTarefas();
        mostrarMensagem('Tarefa atualizada com sucesso!', 'sucesso');
        
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
    }
}

async function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            await fetchAPI(`${API_BASE_URL}${API_ENDPOINT}/${id}`, {
                method: 'DELETE'
            });
            
            await carregarTarefas();
            mostrarMensagem('Tarefa excluída com sucesso!', 'sucesso');
            
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            mostrarMensagem('Erro ao excluir tarefa', 'erro');
        }
    }
}