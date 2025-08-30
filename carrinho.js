document.addEventListener("DOMContentLoaded", function () {

    // 1️⃣ Adicionar produtos ao carrinho
    const botoesCarrinho = document.querySelectorAll(".btn-add-cart");
    botoesCarrinho.forEach(botao => {
        botao.addEventListener("click", function(e) {
            e.preventDefault();

            const produto = {
                nome: this.dataset.nome,
                preco: parseFloat(this.dataset.preco),
                quantidade: 1,
                imagem: this.dataset.imagem
            };

            // Pega o carrinho ou inicia vazio
            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            // Checa se produto já existe
            const existente = carrinho.find(p => p.nome === produto.nome);
            if (existente) {
                existente.quantidade += 1;
            } else {
                carrinho.push(produto);
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            // Só redireciona se não estivermos na página do carrinho
            if (!window.location.href.includes("carrinho.html")) {
                window.location.href = "carrinho.html";
            } else {
                carregarCarrinho();
                atualizarTotais();
            }
        });
    });

    // 2️⃣ Carregar produtos do carrinho na tabela (somente se existir tabela)
    if (document.querySelector("table tbody")) {
        carregarCarrinho();
        atualizarTotais();
    }

    // 3️⃣ Event delegation para +, - e remover
    const tabela = document.querySelector("table");
    if (tabela) {
        tabela.addEventListener("click", function(e) {
            const btn = e.target.closest("button");
            if (!btn) return;

            const tr = btn.closest("tr");
            if (!tr) return;

            // Adicionar quantidade
            if (btn.querySelector(".bx-plus")) alterarQuantidade(tr, 1);

            // Remover quantidade
            if (btn.querySelector(".bx-minus")) alterarQuantidade(tr, -1);

            // Remover item
            if (btn.classList.contains("remove")) removerItem(tr);
        });
    }
});

// Função para carregar carrinho do localStorage
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    carrinho.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="produto">
                    <img src="${produto.imagem}" alt="${produto.nome}" width="100" height="120">
                    <div class="info">
                        <div class="title">${produto.nome}</div>
                    </div>
                </div>
            </td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>
                <div class="qty">
                    <button><i class="bx bx-minus"></i></button>
                    <span>${produto.quantidade}</span>
                    <button><i class="bx bx-plus"></i></button>
                </div>
            </td>
            <td>R$ ${(produto.preco * produto.quantidade).toFixed(2)}</td>
            <td>
                <button class="remove"><i class="bx bx-x"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Atualiza quantidade de um produto
function alterarQuantidade(tr, delta) {
    const span = tr.querySelector(".qty span");
    let quantidade = parseInt(span.textContent);
    quantidade += delta;
    if (quantidade < 1) quantidade = 1;
    span.textContent = quantidade;

    atualizarLinha(tr);
    salvarCarrinho();
    atualizarTotais();
}

// Atualiza total da linha
function atualizarLinha(tr) {
    const preco = parseFloat(tr.querySelector("td:nth-child(2)").textContent.replace("R$", "").replace(",", "."));
    const quantidade = parseInt(tr.querySelector(".qty span").textContent);
    tr.querySelector("td:nth-child(4)").textContent = `R$${(preco * quantidade).toFixed(2)}`;
}

// Atualiza subtotal e total
function atualizarTotais() {
    const linhas = document.querySelectorAll("table tbody tr");
    let subtotal = 0;
    linhas.forEach(linha => {
        const totalLinha = parseFloat(linha.querySelector("td:nth-child(4)").textContent.replace("R$", "").replace(",", "."));
        subtotal += totalLinha;
    });

    const subtotalSpan = document.querySelector(".box .info div:first-child span:last-child");
    const totalSpan = document.querySelector(".box footer span:last-child");

    if (subtotalSpan) subtotalSpan.textContent = `R$${subtotal.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `R$${subtotal.toFixed(2)}`;
}

// Remove item do carrinho
function removerItem(tr) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const nome = tr.querySelector(".title").textContent;

    const index = carrinho.findIndex(p => p.nome === nome);
    if (index !== -1) carrinho.splice(index, 1);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    tr.remove();
    atualizarTotais();
}

// Salva o carrinho atualizado no localStorage
function salvarCarrinho() {
    const carrinho = [];
    document.querySelectorAll("table tbody tr").forEach(tr => {
        const nome = tr.querySelector(".title").textContent;
        const preco = parseFloat(tr.querySelector("td:nth-child(2)").textContent.replace("R$", "").replace(",", "."));
        const quantidade = parseInt(tr.querySelector(".qty span").textContent);
        const imagem = tr.querySelector(".produto img").src;

        carrinho.push({ nome, preco, quantidade, imagem });
    });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}