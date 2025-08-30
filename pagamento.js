document.addEventListener("DOMContentLoaded", function () {
  console.log("Script carregado corretamente.");

  const btnPix = document.getElementById("btn-pix");
  const qrcodeContainer = document.getElementById("qrcode");

  if (!btnPix || !qrcodeContainer) {
    console.error("❌ Elementos não encontrados: btn-pix ou qrcode");
    return;
  }

  btnPix.addEventListener("click", function () {
    console.log("✅ Botão PIX clicado");

    const payload = gerarPayloadPIX({
      chave: "seu-email@exemplo.com",   // <- Troque pela sua chave PIX
      nome: "Nome da Empresa",          // Máx 25 caracteres
      cidade: "SuaCidade",              // Máx 15 caracteres
      valor: "25.00",                   // Valor do pagamento
      descricao: "Pagamento do formulário"
    });

    // Limpa QR anterior
    qrcodeContainer.innerHTML = "";

    // Gera QR Code
    QRCode.toCanvas(qrcodeContainer, payload, {
      width: 256,
      margin: 1
    }, function (err) {
      if (err) {
        console.error("Erro ao gerar QR Code:", err);
      } else {
        console.log("🎉 QR Code gerado com sucesso!");
      }
    });
  });

  function gerarPayloadPIX(dados) {
    function format(id, value) {
      const length = value.length.toString().padStart(2, "0");
      return `${id}${length}${value}`;
    }

    const payloadFormat = format("00", "01");
    const merchantAccountInfo = format("26",
      format("00", "br.gov.bcb.pix") +
      format("01", dados.chave)
    );
    const merchantCategoryCode = format("52", "0000");
    const transactionCurrency = format("53", "986");
    const transactionAmount = format("54", dados.valor);
    const countryCode = format("58", "BR");
    const merchantName = format("59", dados.nome.substring(0, 25));
    const merchantCity = format("60", dados.cidade.substring(0, 15));
    const additionalDataField = format("62", format("05", "***"));

    const payloadSemCRC = payloadFormat +
      merchantAccountInfo +
      merchantCategoryCode +
      transactionCurrency +
      transactionAmount +
      countryCode +
      merchantName +
      merchantCity +
      additionalDataField;

    const crc16 = calcularCRC16(payloadSemCRC + "6304");

    return payloadSemCRC + "6304" + crc16;
  }

  function calcularCRC16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
  }
});