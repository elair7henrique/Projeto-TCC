
document.addEventListener("DOMContentLoaded", function () {
    atualizarTotais();
    

    const botoesPlus = document.querySelectorAll(".bx-plus");
    const botoesMinus = document.querySelectorAll(".bx-minus");
    const botoesRemover = document.querySelectorAll(".remove");

    botoesPlus.forEach(btn => {
        btn.addEventListener("click", function () {
            alterarQuantidade(this, 1);
        });
    });

    botoesMinus.forEach(btn => {
        btn.addEventListener("click", function () {
            alterarQuantidade(this, -1);
        });
    });

    botoesRemover.forEach(btn => {
        btn.addEventListener("click", function () {
            removerItem(this);
        });
    });
});

function alterarQuantidade(botao, delta) {
    const qtyDiv = botao.closest(".qty");
    const span = qtyDiv.querySelector("span");
    let quantidade = parseInt(span.textContent);

    quantidade += delta;
    if (quantidade < 1) quantidade = 1;

    span.textContent = quantidade;

    atualizarLinha(botao.closest("tr"));
    atualizarTotais();
}

function atualizarLinha(tr) {
    const preco = parseFloat(tr.querySelector("td:nth-child(2)").textContent.replace("R$", "").replace(",", "."));
    const quantidade = parseInt(tr.querySelector(".qty span").textContent);
    const total = preco * quantidade;

    tr.querySelector("td:nth-child(4)").textContent = `R$${total.toFixed(2)}`;
}

function atualizarTotais() {
    const linhas = document.querySelectorAll("table tbody tr");
    let subtotal = 0;

    linhas.forEach(linha => {
        const totalLinha = parseFloat(linha.querySelector("td:nth-child(4)").textContent.replace("R$", "").replace(",", "."));
        subtotal += totalLinha;
    });

    document.querySelector(".box .info div:first-child span:last-child").textContent = `R$${subtotal.toFixed(2)}`;
    document.querySelector(".box footer span:last-child").textContent = `R$${subtotal.toFixed(2)}`;
}

function removerItem(botao) {
    const tr = botao.closest("tr");
    tr.remove();
    atualizarTotais();
}