// --- ESTADO DA APLICAÇÃO ---
let currentFilter = 'all';
let searchTimeout = null; // Para o debounce

// --- DADOS MOCKADOS ---
const mockData = [
    {
        id: 1,
        tipo: 'pasta',
        titulo: 'Processo Civil - João Silva',
        cliente: 'João Silva',
        numero: 'P-2024-001',
        data: '2024-01-15',
        status: 'Em andamento',
        descricao: 'Processo relacionado a questões contratuais'
    },
    {
        id: 2,
        tipo: 'cliente',
        titulo: 'Maria Santos',
        cliente: 'Maria Santos',
        numero: 'C-2024-045',
        data: '2024-02-20',
        status: 'Ativo',
        descricao: 'Cliente com múltiplos processos em andamento'
    },
    {
        id: 3,
        tipo: 'documento',
        titulo: 'Contrato de Prestação de Serviços',
        cliente: 'Empresa XYZ Ltda',
        numero: 'DOC-2024-123',
        data: '2024-03-10',
        status: 'Assinado',
        descricao: 'Contrato de prestação de serviços jurídicos'
    },
    {
        id: 4,
        tipo: 'pasta',
        titulo: 'Processo Trabalhista - Funcionários',
        cliente: 'Empresa ABC',
        numero: 'P-2024-078',
        data: '2024-01-28',
        status: 'Em análise',
        descricao: 'Processo trabalhista coletivo'
    },
    {
        id: 5,
        tipo: 'cliente',
        titulo: 'Carlos Oliveira',
        cliente: 'Carlos Oliveira',
        numero: 'C-2024-089',
        data: '2024-03-05',
        status: 'Ativo',
        descricao: 'Cliente pessoa física'
    },
    {
        id: 6,
        tipo: 'documento',
        titulo: 'Petição Inicial',
        cliente: 'Ana Costa',
        numero: 'DOC-2024-156',
        data: '2024-03-15',
        status: 'Protocolado',
        descricao: 'Petição inicial para processo de divórcio'
    }
];

// --- LÓGICA CENTRAL DE BUSCA E FILTRO ---
const executarBuscaEFiltro = async () => {
    const searchInput = document.getElementById('search');
    const query = searchInput.value.trim().toLowerCase();

    // Regra de validação: Se tem texto, precisa ter pelo menos 2 caracteres
    // Se não tem texto, a gente deixa passar para mostrar os filtros (ex: clicar em Clientes mostra todos os clientes)
    if (query.length > 0 && query.length < 2) {
        showEmptyState('Digite pelo menos 2 caracteres para pesquisar.');
        return;
    }

    // UI: Loading
    showLoading(true);
    hideResults();
    hideEmptyState();

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
        // --- AQUI ESTÁ A CORREÇÃO PRINCIPAL ---
        // Filtramos o mockData original aplicando AMBAS as regras (Tipo E Texto)
        const resultados = mockData.filter(item => {
            // 1. Verifica se bate com o filtro (aba selecionada)
            const matchTipo = currentFilter === 'all' || item.tipo === currentFilter;

            // 2. Verifica se bate com o texto (se houver texto)
            // Se query for vazia, retorna true (mostra tudo da categoria).
            const matchTexto = query === '' || (
                item.titulo.toLowerCase().includes(query) ||
                (item.cliente && item.cliente.toLowerCase().includes(query)) ||
                item.numero.toLowerCase().includes(query) ||
                (item.descricao && item.descricao.toLowerCase().includes(query))
            );

            return matchTipo && matchTexto;
        });

        showLoading(false);

        if (resultados.length > 0) {
            displayResults(resultados);
        } else {
            // Mensagens inteligentes baseadas no contexto
            const nomeFiltro = traduzirTipo(currentFilter);
            if (query) {
                showEmptyState(`Nenhum resultado para "${query}" em ${nomeFiltro}.`);
            } else {
                showEmptyState(`Nenhum item encontrado em ${nomeFiltro}.`);
            }
        }

    } catch (error) {
        console.error('Erro na busca:', error);
        showLoading(false);
        showEmptyState('Erro ao processar dados. Tente novamente.');
    }
};

// --- GATILHOS (Event Handlers) ---

// Chamada pelo input de texto (função wrapper)
const buscar = () => {
    executarBuscaEFiltro();
};

// Chamada pelos botões de filtro (abas)
const filterResults = (filter) => {
    currentFilter = filter;

    // Atualiza visual dos botões
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        // Comparação flexível para achar o botão certo pelo texto ou atributo
        const btnText = btn.textContent.trim().toLowerCase();
        const map = { 'all': 'todos', 'pasta': 'pastas', 'cliente': 'clientes', 'documento': 'documentos' };
        if (map[filter] === btnText) {
            btn.classList.add('active');
        }
    });

    // Dispara a busca novamente com o novo filtro
    executarBuscaEFiltro();
};

// --- FUNÇÕES DE UI (Exibição) ---

const displayResults = (results) => {
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const container = document.getElementById('resultsContainer');

    // Limpa resultados anteriores
    resultsGrid.innerHTML = '';

    // Cria os cards
    results.forEach((item, index) => {
        const card = createResultCard(item, index);
        resultsGrid.appendChild(card);
    });

    // Atualiza contador
    const count = results.length;
    resultsCount.innerHTML = `<strong>${count}</strong> ${count === 1 ? 'resultado encontrado' : 'resultados encontrados'}`;

    // Mostra container
    container.style.display = 'block';
    setTimeout(() => {
        container.classList.add('show');
    }, 10);
};

const createResultCard = (item, index) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const iconMap = {
        'pasta': 'fa-folder',
        'cliente': 'fa-user',
        'documento': 'fa-file-alt'
    };

    const typeLabels = {
        'pasta': 'Pasta',
        'cliente': 'Cliente',
        'documento': 'Documento'
    };

    card.innerHTML = `
        <div class="card-header">
            <div class="card-icon">
                <i class="fa-solid ${iconMap[item.tipo] || 'fa-file'}"></i>
            </div>
            <div class="card-title">
                <h3>${escapeHtml(item.titulo)}</h3>
                <span class="card-type">${typeLabels[item.tipo] || item.tipo}</span>
            </div>
        </div>
        <div class="card-body">
            <div class="card-info">
                <div class="info-item">
                    <i class="fa-solid fa-hashtag"></i>
                    <span>${escapeHtml(item.numero)}</span>
                </div>
                ${item.cliente ? `
                <div class="info-item">
                    <i class="fa-solid fa-user-tie"></i>
                    <span>${escapeHtml(item.cliente)}</span>
                </div>
                ` : ''}
                <div class="info-item">
                    <i class="fa-solid fa-calendar"></i>
                    <span>${formatDate(item.data)}</span>
                </div>
                ${item.status ? `
                <div class="info-item">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>${escapeHtml(item.status)}</span>
                </div>
                ` : ''}
            </div>
            ${item.descricao ? `
            <p style="margin-top: 15px; font-size: 0.9rem; color: var(--text-light); line-height: 1.5;">
                ${escapeHtml(item.descricao)}
            </p>
            ` : ''}
        </div>
        <div class="card-footer">
            <span class="card-date">${formatDate(item.data)}</span>
            <button class="btn-view" onclick="viewItem(${item.id}, '${item.tipo}')">
                Ver Detalhes <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>
            </button>
        </div>
    `;

    // Efeitos hover
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-5px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');

    return card;
};

// --- HELPERS E UTILITÁRIOS ---

const showLoading = (show) => {
    const loading = document.getElementById('loading');
    if (show) loading.classList.add('show');
    else loading.classList.remove('show');
};

const hideResults = () => {
    const container = document.getElementById('resultsContainer');
    container.classList.remove('show');
    setTimeout(() => {
        if (!container.classList.contains('show')) container.style.display = 'none';
    }, 400);
};

const showEmptyState = (message = '') => {
    const emptyState = document.getElementById('emptyState');
    if (message) {
        const p = emptyState.querySelector('p');
        if (p) p.textContent = message;
    }
    emptyState.style.display = 'block';
    setTimeout(() => emptyState.classList.add('show'), 10);
};

const hideEmptyState = () => {
    const emptyState = document.getElementById('emptyState');
    emptyState.classList.remove('show');
    setTimeout(() => {
        if (!emptyState.classList.contains('show')) emptyState.style.display = 'none';
    }, 400);
};

const viewItem = (id, tipo) => {
    alert(`Visualizando ${tipo} #${id} - Integração backend pendente.`);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

const traduzirTipo = (tipo) => {
    const map = { 'all': 'Todos', 'pasta': 'Pastas', 'cliente': 'Clientes', 'documento': 'Documentos' };
    return map[tipo] || tipo;
};

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');

    // Resetar UI
    hideResults();
    hideEmptyState();
    searchInput.focus();

    // Event Listener com Debounce para o input
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value.trim();

        // Se limpou o campo, podemos rodar a busca imediatamente (vai mostrar todos do filtro)
        // Se está digitando, esperamos 500ms
        const delay = query.length === 0 ? 0 : 500;

        searchTimeout = setTimeout(() => {
            buscar();
        }, delay);
    });

    // Enter para buscar imediatamente
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            buscar();
        }
    });
});