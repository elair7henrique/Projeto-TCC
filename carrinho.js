document.addEventListener("DOMContentLoaded", function () {

    const botoesCarrinho = document.querySelectorAll(".btn-add-cart");
    botoesCarrinho.forEach(botao => {
        botao.addEventListener("click", function(e) {
            e.preventDefault();

            const produto = {
                nome: this.dataset.nome,
                preco: parseFloat(this.dataset.preco),
                imagem: this.dataset.imagem || "",
                categoria: this.dataset.categoria || "",
                quantidade: 1
            };

            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            const existente = carrinho.find(p => p.nome === produto.nome);
            if (existente) {
                existente.quantidade += 1;
            } else {
                carrinho.push(produto);
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            carregarCarrinho();
            atualizarTotais();

            const mensagemSucesso = document.createElement("div");
            mensagemSucesso.classList.add("mensagem-sucesso");
            mensagemSucesso.innerText = "Produto adicionado ao carrinho!";
            document.body.appendChild(mensagemSucesso);

            setTimeout(() => {
                mensagemSucesso.remove();
                location.assign("carrinho.html"); 
            }, 2000);
        });
    });

    const tabela = document.querySelector("table tbody");
    tabela.addEventListener("click", function(e) {
        const btn = e.target.closest("button");
        if (!btn) return;

        const tr = btn.closest("tr");
        if (!tr) return;

        if (btn.querySelector("i.bx-plus")) alterarQuantidade(tr, 1);

        if (btn.querySelector("i.bx-minus")) alterarQuantidade(tr, -1);

        if (btn.classList.contains("remove")) removerItem(tr);
    });

    carregarCarrinho();
    atualizarTotais();

    const finalizarBtn = document.getElementById("finalizarCompra");
    if (finalizarBtn) {
        finalizarBtn.addEventListener("click", function() {
            window.location.href = "pagina_final.html"; 
        });
    }
});

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

function atualizarLinha(tr) {
    const preco = parseFloat(tr.querySelector("td:nth-child(2)").textContent.replace("R$", "").replace(",", "."));
    const quantidade = parseInt(tr.querySelector(".qty span").textContent);
    tr.querySelector("td:nth-child(4)").textContent = `R$${(preco * quantidade).toFixed(2)}`;
}

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

function removerItem(tr) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const nome = tr.querySelector(".title").textContent;

    const index = carrinho.findIndex(p => p.nome === nome);
    if (index !== -1) carrinho.splice(index, 1);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    tr.remove();
    atualizarTotais();
}

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