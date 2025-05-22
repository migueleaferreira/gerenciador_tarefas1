// Banco de dados no LocalStorage
const bancoDeDados = {
    carregar: () => JSON.parse(localStorage.getItem('tarefas')) || [],
    salvar: (tarefas) => localStorage.setItem('tarefas', JSON.stringify(tarefas))
};

// Controlador principal
const gerenciador = {
    tarefas: bancoDeDados.carregar(),

    adicionar: (tarefa) => {
        gerenciador.tarefas.push({
            id: Date.now(),
            ...tarefa,
            progresso: 0,
            concluida: false
        });
        bancoDeDados.salvar(gerenciador.tarefas);
        view.atualizar();
    },

    remover: (id) => {
        gerenciador.tarefas = gerenciador.tarefas.filter(t => t.id !== id);
        bancoDeDados.salvar(gerenciador.tarefas);
        view.atualizar();
    },

    atualizarProgresso: (id, progresso) => {
        const tarefa = gerenciador.tarefas.find(t => t.id === id);
        if (tarefa) {
            tarefa.progresso = Math.max(0, Math.min(100, progresso));
            bancoDeDados.salvar(gerenciador.tarefas);
            view.atualizar();
        }
    },

    concluir: (id) => {
        const tarefa = gerenciador.tarefas.find(t => t.id === id);
        if (tarefa) {
            tarefa.concluida = !tarefa.concluida;
            tarefa.progresso = tarefa.concluida ? 100 : 0;
            bancoDeDados.salvar(gerenciador.tarefas);
            view.atualizar();
        }
    }
};

// Visualização
const view = {
    atualizar: () => {
        const lista = document.getElementById('lista-tarefas');
        lista.innerHTML = gerenciador.tarefas.map(tarefa => `
            <li class="tarefa ${tarefa.concluida ? 'tarefa-concluida' : ''}">
                <strong>${tarefa.titulo}</strong>
                <p>${tarefa.descricao}</p>
                <small>
                    Prazo: ${tarefa.prazo} | 
                    Prioridade: ${tarefa.prioridade} | 
                    Categoria: ${tarefa.categoria}
                </small>
                
                <div class="barra-progresso">
                    <div class="barra-progresso-fill" style="width: ${tarefa.progresso}%"></div>
                </div>
                <small>Progresso: ${tarefa.progresso}%</small>
                
                <div class="acoes">
                    <form class="inline" onsubmit="event.preventDefault();">
                        <input 
                            type="number" 
                            value="${tarefa.progresso}" 
                            min="0" 
                            max="100" 
                            onchange="gerenciador.atualizarProgresso(${tarefa.id}, this.value)"
                        >
                        <button type="button">Atualizar</button>
                    </form>
                    
                    <button onclick="gerenciador.concluir(${tarefa.id})">
                        ${tarefa.concluida ? 'Desfazer' : 'Concluir'}
                    </button>
                    <button onclick="gerenciador.remover(${tarefa.id})">Remover</button>
                </div>
            </li>
        `).join('');
    }
};

// Formulário
document.getElementById('form-tarefa').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    gerenciador.adicionar(Object.fromEntries(formData));
    e.target.reset();
});

// Inicialização
view.atualizar();