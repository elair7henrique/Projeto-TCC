document.addEventListener("DOMContentLoaded", function () {

    // 1️⃣ Botões "Adicionar ao carrinho"
    const botoesCarrinho = document.querySelectorAll(".btn-add-cart");
    botoesCarrinho.forEach(botao => {
        botao.addEventListener("click", function(e) {
            e.preventDefault();

            // Pega dados do produto
            const produto = {
                nome: this.dataset.nome,
                preco: parseFloat(this.dataset.preco),
                imagem: this.dataset.imagem || "",
                categoria: this.dataset.categoria || "",
                quantidade: 1
            };

            // Pega carrinho do localStorage
            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            // Verifica se produto já existe no carrinho
            const existente = carrinho.find(p => p.nome === produto.nome);
            if (existente) {
                existente.quantidade += 1;
            } else {
                carrinho.push(produto);
            }

            // Salva e atualiza a tabela
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            carregarCarrinho();
            atualizarTotais();
        });
    });

    // 2️⃣ Delegação de eventos na tabela (alterar quantidade e remover)
    const tabela = document.querySelector("table tbody");
    tabela.addEventListener("click", function(e) {
        const btn = e.target.closest("button");
        if (!btn) return;

        const tr = btn.closest("tr");
        if (!tr) return;

        // Adicionar quantidade
        if (btn.querySelector("i.bx-plus")) alterarQuantidade(tr, 1);

        // Remover quantidade
        if (btn.querySelector("i.bx-minus")) alterarQuantidade(tr, -1);

        // Remover item
        if (btn.classList.contains("remove")) removerItem(tr);
    });

    // 3️⃣ Carregar carrinho ao abrir a página
    carregarCarrinho();
    atualizarTotais();

    // 4️⃣ Finalizar compra
    const finalizarBtn = document.getElementById("finalizarCompra");
    if (finalizarBtn) {
        finalizarBtn.addEventListener("click", function() {
            window.location.href = "pagina_final.html"; // destino
        });
    }
});

// ================= Funções ================= //

// Carrega carrinho do localStorage e renderiza tabela
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
                        <div class="categoria">${produto.categoria || ""}</div>
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

// Alterar quantidade de um produto
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

// Atualiza o valor da linha
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

// Remove produto do carrinho
function removerItem(tr) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const nome = tr.querySelector(".title").textContent;

    const index = carrinho.findIndex(p => p.nome === nome);
    if (index !== -1) carrinho.splice(index, 1);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    tr.remove();
    atualizarTotais();
}

// Salva carrinho atualizado no localStorage
function salvarCarrinho() {
    const carrinho = [];
    document.querySelectorAll("table tbody tr").forEach(tr => {
        const nome = tr.querySelector(".title").textContent;
        const preco = parseFloat(tr.querySelector("td:nth-child(2)").textContent.replace("R$", "").replace(",", "."));
        const quantidade = parseInt(tr.querySelector(".qty span").textContent);
        const imagem = tr.querySelector(".produto img").src;
        const categoria = tr.querySelector(".categoria") ? tr.querySelector(".categoria").textContent : "";

        carrinho.push({ nome, preco, quantidade, imagem, categoria });
    });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}