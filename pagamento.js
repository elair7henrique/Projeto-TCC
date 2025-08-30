const form = document.getElementById("form-pagamento");
const opcaoPix = document.querySelector('input[value="pix"]');
const opcaoCartao = document.querySelector('input[value="cartao"]');
const dadosCartao = document.getElementById("dados-cartao");

document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
  radio.addEventListener("change", () => {
    dadosCartao.style.display = (opcaoCartao.checked) ? "block" : "none";
  });
});

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const metodo = document.querySelector('input[name="pagamento"]:checked').value;
  if (metodo === "pix") {
    window.location.href = "pix.html";
  } else {
    window.location.href = "confirmacao.html";
  }
});

dadosCartao.style.display = (opcaoCartao.checked) ? "block" : "none";