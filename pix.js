const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let total = 0;
carrinho.forEach(p => total += p.preco * p.quantidade);
total = total.toFixed(2);

const pixKey = "donutsdreamland@pix.com";
const textoQr = `pix:${pixKey}?amount=${total}`;

new QRCode(document.getElementById("qrcode"), {
  text: textoQr,
  width: 200,
  height: 200,
});