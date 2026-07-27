// 1. Mapeamento de elementos do HTML
const canvas = document.getElementById("quadrado-assinatura");
const botãoLimpar = document.getElementById("botão-limpar");
const formulario = document.getElementById("formulario-epi");
const selectEpi = document.getElementById("Lista-epis");
const campoBusca = document.getElementById("busca-epi");
const containerCarrinho = document.getElementById("carrinho-epis");

// URL da API Node.js no Render
const API_URL = "https://api-site-de-confirma-o-de-epi.onrender.com";

// Contexto do Canvas (2D)
const contexto = canvas.getContext("2d");
let desenhando = false;

// Estado global do carrinho de EPIs
let carrinho = [];

// ==========================================
// LÓGICA DO CANVAS (DESENHO DA ASSINATURA)
// ==========================================

function iniciarDesenho(evento) {
    desenhando = true;
    contexto.beginPath();
}

function pararDesenho() {
    desenhando = false;
}

function desenhar(evento) {
    if (!desenhando) return;
    evento.preventDefault();

    const limites = canvas.getBoundingClientRect();
    const clienteX = evento.touches ? evento.touches[0].clientX : evento.clientX;
    const clienteY = evento.touches ? evento.touches[0].clientY : evento.clientY;

    const posiçãoX = (clienteX - limites.left) * (canvas.width / limites.width);
    const posiçãoY = (clienteY - limites.top) * (canvas.height / limites.height);

    contexto.lineWidth = 2;
    contexto.lineCap = "round";
    contexto.strokeStyle = "#000000";

    contexto.lineTo(posiçãoX, posiçãoY);
    contexto.stroke();
}

// Eventos de Mouse e Touch no Canvas
canvas.addEventListener("mousedown", iniciarDesenho);
canvas.addEventListener("mouseup", pararDesenho);
canvas.addEventListener("mousemove", desenhar);

canvas.addEventListener("touchstart", iniciarDesenho);
canvas.addEventListener("touchend", pararDesenho);
canvas.addEventListener("touchmove", desenhar);

function limparTela() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}

botãoLimpar.addEventListener("click", limparTela);

// ==========================================
// CARREGAR ESTOQUE DO BACK-END / FIREBASE
// ==========================================

async function carregarEstoque() {
    try {
        const resposta = await fetch(`${API_URL}/estoque`);
        if (!resposta.ok) throw new Error("Erro ao carregar estoque.");

        const inventario = await resposta.json();
        
        selectEpi.innerHTML = '<option value="">Selecione um EPI para adicionar...</option>';
        
        inventario.forEach(item => {

            const limiteRetirada = item.quantidadePadrao !== undefined 
                ? item.quantidadePadrao 
                : (item.quantidade || 1);

            selectEpi.innerHTML += `
                <option value="${item.id}" 
                        data-nome="${item.nome}" 
                        data-limite="${limiteRetirada}">
                    ${item.nome} (Estoque: ${item.quantidade || 0})
                </option>
            `;
        });
    } catch (erro) {
        console.warn("Não foi possível carregar o estoque do Firebase em tempo real.", erro);
    }
}

// ==========================================
// LÓGICA DO CARRINHO DE EPIs
// ==========================================

// Adicionar item ao selecionar no dropdown
selectEpi.addEventListener("change", function() {
    const opcaoSelecionada = selectEpi.options[selectEpi.selectedIndex];
    if (!opcaoSelecionada.value) return;

    const id = opcaoSelecionada.value;
    const nome = opcaoSelecionada.dataset.nome || opcaoSelecionada.text;
    const limiteMax = parseInt(opcaoSelecionada.dataset.limite || "1", 10);

    const itemExistente = carrinho.find(i => i.id === id);

    if (itemExistente) {
        if (itemExistente.quantidade < limiteMax) {
            itemExistente.quantidade++;
        } else {
            alert(`O limite máximo para "${nome}" é de ${limiteMax} unidade(s).`);
        }
    } else {
        carrinho.push({ id, nome, quantidade: 1, limiteMax });
    }

    selectEpi.value = ""; // Reseta o select
    renderizarCarrinho();
});

// Alterar quantidade (+ / -)
window.alterarQtd = function(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;

    const novaQtd = item.quantidade + delta;

    if (novaQtd >= 1 && novaQtd <= item.limiteMax) {
        item.quantidade = novaQtd;
    } else if (novaQtd > item.limiteMax) {
        alert(`O limite máximo para "${item.nome}" é de ${item.limiteMax} unidade(s).`);
    }

    renderizarCarrinho();
};

// Remover item do carrinho
window.removerItem = function(id) {
    carrinho = carrinho.filter(i => i.id !== id);
    renderizarCarrinho();
};

// Atualizar interface do carrinho
function renderizarCarrinho() {
    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = '<p class="carrinho-vazio">Nenhum equipamento adicionado.</p>';
        return;
    }

    containerCarrinho.innerHTML = carrinho.map(item => `
        <div class="item-carrinho">
            <span class="nome-item-carrinho">${item.nome}</span>
            <div class="controles-quantidade">
                <button type="button" class="btn-qtd" onclick="alterarQtd('${item.id}', -1)">-</button>
                <span class="qtd-valor">${item.quantidade}</span>
                <button type="button" class="btn-qtd" onclick="alterarQtd('${item.id}', 1)">+</button>
                <button type="button" class="btn-remover-item" onclick="removerItem('${item.id}')">X</button>
            </div>
        </div>
    `).join("");
}

// ==========================================
// FILTRO DE BUSCA NO SELECT
// ==========================================

if (campoBusca && selectEpi) {
    campoBusca.addEventListener("input", function() {
        const textoDigitado = campoBusca.value.toLowerCase();
        const opcoes = selectEpi.options;

        for (let i = 0; i < opcoes.length; i++) {
            const textoOpcao = opcoes[i].text.toLowerCase();
            const visivel = textoOpcao.includes(textoDigitado);
            opcoes[i].hidden = !visivel;
            opcoes[i].style.display = visivel ? "" : "none";
        }
    });
}

// ==========================================
// ENVIO DO FORMULÁRIO PARA A API
// ==========================================

async function enviarFormulario(evento) {
    evento.preventDefault();

    if (carrinho.length === 0) {
        alert("Adicione pelo menos um EPI ao carrinho antes de enviar.");
        return;
    }

    const nome = document.getElementById("nome-funcionario").value;
    const baseoperacional = document.getElementById("base-operacional").value;
    const imagemAssinatura = canvas.toDataURL();

    // Payload pronto para o Node.js/Firestore
    const dadosEnvio = {
        nome,
        baseOperacional: baseoperacional,
        itens: carrinho, // Array de objetos { id, nome, quantidade }
        assinatura: imagemAssinatura
    };

    try {
        const resposta = await fetch(`${API_URL}/entrega`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosEnvio)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao registrar a retirada no servidor.");
        }

        alert("Retirada registrada com sucesso!");

        // Limpeza e reset
        formulario.reset();
        carrinho = [];
        renderizarCarrinho();
        limparTela();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao enviar a retirada. Verifique a conexão.");
    }
}

formulario.addEventListener("submit", enviarFormulario);

// Carrega o estoque do backend quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", carregarEstoque);