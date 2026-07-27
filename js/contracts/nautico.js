/**
 * Template de Contrato de Embarcação Náutica
 * Vendedora: Comfort Ind e Comércio LTDA
 * Baseado no modelo: MODELO CONTRATO DE COMPRA E VENDA.docx.pdf
 */

window.VenturaContracts = window.VenturaContracts || {};

window.VenturaContracts.nautico = function(data) {
  return [
    // --- TÍTULO ---
    {
      text: 'CONTRATO DE COMPRA E VENDA DE EMBARCAÇÃO NÁUTICA',
      bold: true,
      size: 14,
      align: 'center',
      spaceAfter: 10
    },
    // --- VENDEDOR ---
    {
      text: 'VENDEDOR: COMFORT IND E COMÉRCIO LTDA, com sede na Estrada do Morro Preto S/N KM 01, Zona Rural, Capitólio, Estado de Minas Gerais, CEP 37930-000, inscrita no CNPJ/ME sob o N° 10.215.056/0001-17, doravante denominada VENDEDORA.',
      size: 10,
      spaceAfter: 6
    },
    // --- COMPRADOR ---
    {
      text: `COMPRADOR(A): ${data.nome || '_______________'}, inscrito(a) no CPF sob o nº ${data.cpf || '_______________'}, RG ${data.rg || '_______________'}, residente e domiciliado à ${data.endereco || '_______________'}, telefone para contato ${data.telefone || '_______________'}, e-mail ${data.email || '_______________'}, doravante denominado(a) COMPRADOR(A).`,
      size: 10,
      spaceAfter: 6
    },
    {
      text: 'As partes acima identificadas têm entre si justo e contratado o presente Contrato de Compra e Venda de Embarcação Náutica, que se regerá pelas cláusulas seguintes e pelas condições ora descritas:',
      size: 10,
      spaceAfter: 8
    },
    // --- DO OBJETO ---
    {
      text: 'DO OBJETO DO CONTRATO:',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `O presente contrato tem como OBJETO a compra e venda de uma embarcação - Marca VENTURA MARINE, Modelo ${data.modeloBarco || '_______________'}, cor do casco ${data.corCasco || '_______________'}, cor dos estofamentos ${data.corEstofamentos || '_______________'}, ano/modelo ${data.anoModelo || '_______________'}, equipada com motorização ${data.motorizacao || '_______________'} e todos os itens de montagem.`,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `Acessórios: ${data.acessorios || '_______________'}`,
      size: 10,
      spaceAfter: 2
    },
    ...(data.origem === 'SHOWROOM' ? [{
      text: 'Observação: Embarcação disponível no SHOWROOM',
      size: 10,
      bold: true,
      spaceAfter: 8
    }] : []),
    // --- DO PREÇO ---
    {
      text: 'DO PREÇO E CONDIÇÕES DE PAGAMENTO:',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `O valor total da embarcação objeto de compra e venda é de R$ ${data.valorTotal || '_______________'}, que será pago pelo COMPRADOR(A) da seguinte forma:`,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `Sinal: R$ ${data.valorSinal || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Entrada: R$ ${data.valorEntrada || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Permuta: ${data.permuta || '_______________'}, com todas as manutenções em dia e em bom estado de conservação.`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Contra embarque: R$ ${data.contraEmbarque || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Parcelamento boleto: R$ ${data.parcelamentoFabrica || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Parcelamento bancário/cartão de crédito: ${data.parcelamentoBancario || '_______________'}`,
      size: 10,
      spaceAfter: 5
    },
    {
      text: '2.1. Em caso de troca ou permuta, o bem ficará em poder da VENDEDORA, a título de garantia real, até sua venda a terceiro adquirente. O valor da venda será utilizado para abatimento parcial do preço deste contrato.',
      size: 10,
      spaceAfter: 5
    },
    // --- DADOS BANCÁRIOS ---
    {
      text: 'Dados para depósito:',
      bold: true,
      size: 10,
      spaceAfter: 2
    },
    {
      text: 'Comfort Ind. Com. Ltda – CNPJ: 10.215.056/0001-17',
      size: 10,
      spaceAfter: 1
    },
    {
      text: 'Banco Santander – 033',
      size: 10,
      spaceAfter: 1
    },
    {
      text: 'Agência: 0288',
      size: 10,
      spaceAfter: 1
    },
    {
      text: 'Conta Corrente 13008585-0',
      size: 10,
      spaceAfter: 1
    },
    {
      text: 'PIX (37) 98825-8793',
      size: 10,
      spaceAfter: 8
    },
    // --- PRAZO DE ENTREGA ---
    {
      text: 'DO PRAZO DE ENTREGA DO PRODUTO, PELA VENDEDORA',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `A VENDEDORA terá um prazo de entrega da embarcação de ${data.prazoEntrega || '_______________'} úteis, contados a partir da assinatura do contrato e do pagamento da entrada, na cidade de ${data.cidadeEntrega || '_______________'}. As despesas de frete serão de responsabilidade do(a) ${data.responsavelFrete || '_______________'}.`,
      size: 10,
      spaceAfter: 4
    },
    {
      text: 'A entrega é realizada na sede da VENDEDORA, localizada na Estrada do Morro Preto, S/N – KM 01 – Zona Rural, Capitólio/MG – CEP 37.930-000. Fica estabelecido que todas as despesas e responsabilidades relativas ao transporte da embarcação até o domicílio do COMPRADOR, ou para outro local por ele indicado, serão integralmente de sua responsabilidade.',
      size: 10,
      spaceAfter: 8
    },
    // --- OBSERVAÇÕES GERAIS ---
    {
      text: 'DAS OBSERVAÇÕES GERAIS:',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Do pagamento do sinal - O COMPRADOR(A) deverá efetuar o pagamento de um sinal, no ato da assinatura deste contrato, como forma de garantir o pedido e assegurar além da data de entrega as condições especiais acordadas.',
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Do financiamento - O COMPRADOR(A) que optar por financiamento bancário estará sujeito à aprovação de crédito pela instituição financeira após o envio da documentação solicitada.',
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Da documentação e impostos – O COMPRADOR(A) é responsável pela documentação e diferenças de impostos entre estados caso haja.',
      size: 10,
      spaceAfter: 8
    },
    // --- FORO ---
    {
      text: 'DO FORO',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da comarca de Piumhi-MG, com exclusão de qualquer outro, por mais privilegiado que seja.',
      size: 10,
      spaceAfter: 12
    },
    // --- DATA E ASSINATURAS ---
    {
      text: `Capitólio, ${data.dataContrato || '______ de _____________ de ________'}`,
      size: 10,
      spaceAfter: 20
    },
    {
      text: '___________________________________________________________________',
      size: 10,
      align: 'center',
      spaceAfter: 1
    },
    {
      text: 'VENDEDOR: COMFORT IND E COMÉRCIO LTDA',
      size: 10,
      align: 'center',
      spaceAfter: 1
    },
    {
      text: 'CNPJ: 10.215.056/0001-17',
      size: 10,
      align: 'center',
      spaceAfter: 15
    },
    {
      text: '___________________________________________________________________',
      size: 10,
      align: 'center',
      spaceAfter: 1
    },
    {
      text: `COMPRADOR(A): ${data.nome || '_______________'}`,
      size: 10,
      align: 'center',
      spaceAfter: 1
    },
    {
      text: `CPF: ${data.cpf || '_______________'}`,
      size: 10,
      align: 'center',
      spaceAfter: 0
    }
  ];
};

/**
 * Gera o texto de preview (HTML) do contrato Náutico
 */
window.VenturaContracts.nauticoPreview = function(data) {
  return `
    <h3>CONTRATO DE COMPRA E VENDA DE EMBARCAÇÃO NÁUTICA</h3>
    <div class="contract-section">
      <p class="clause-title">VENDEDOR</p>
      <p><strong>COMFORT IND E COMÉRCIO LTDA</strong></p>
      <p><span class="contract-label">CNPJ:</span> 10.215.056/0001-17</p>
      <p><span class="contract-label">Sede:</span> Estrada do Morro Preto S/N KM 01, Capitólio/MG</p>
    </div>
    <div class="contract-section">
      <p class="clause-title">COMPRADOR(A)</p>
      <p><span class="contract-label">Nome:</span> <span class="contract-value">${data.nome || '—'}</span></p>
      <p><span class="contract-label">CPF:</span> <span class="contract-value">${data.cpf || '—'}</span></p>
      <p><span class="contract-label">RG:</span> <span class="contract-value">${data.rg || '—'}</span></p>
      <p><span class="contract-label">Endereço:</span> <span class="contract-value">${data.endereco || '—'}</span></p>
      <p><span class="contract-label">Telefone:</span> <span class="contract-value">${data.telefone || '—'}</span></p>
      <p><span class="contract-label">E-mail:</span> <span class="contract-value">${data.email || '—'}</span></p>
    </div>
    <div class="contract-section">
      <p class="clause-title">DO OBJETO DO CONTRATO</p>
      <p><span class="contract-label">Marca:</span> VENTURA MARINE</p>
      <p><span class="contract-label">Modelo:</span> <span class="contract-value">${data.modeloBarco || '—'}</span></p>
      <p><span class="contract-label">Cor do casco:</span> <span class="contract-value">${data.corCasco || '—'}</span> | <span class="contract-label">Estofamentos:</span> <span class="contract-value">${data.corEstofamentos || '—'}</span></p>
      <p><span class="contract-label">Ano/Modelo:</span> <span class="contract-value">${data.anoModelo || '—'}</span> | <span class="contract-label">Motorização:</span> <span class="contract-value">${data.motorizacao || '—'}</span></p>
      <p><span class="contract-label">Acessórios:</span> <span class="contract-value">${data.acessorios || '—'}</span></p>
      ${data.origem === 'SHOWROOM' ? '<p><span class="contract-label">Origem:</span> <span class="contract-value" style="font-weight:700; color: var(--color-success)">🏬 Disponível no Showroom</span></p>' : ''}
    </div>
    <div class="contract-section">
      <p class="clause-title">DO PREÇO E CONDIÇÕES DE PAGAMENTO</p>
      <p><span class="contract-label">Valor total:</span> <span class="contract-value">R$ ${data.valorTotal || '—'}</span></p>
      <p><span class="contract-label">Sinal:</span> <span class="contract-value">R$ ${data.valorSinal || '—'}</span></p>
      <p><span class="contract-label">Entrada:</span> <span class="contract-value">R$ ${data.valorEntrada || '—'}</span></p>
      <p><span class="contract-label">Permuta:</span> <span class="contract-value">${data.permuta || '—'}</span></p>
      <p><span class="contract-label">Contra embarque:</span> <span class="contract-value">R$ ${data.contraEmbarque || '—'}</span></p>
      <p><span class="contract-label">Parc. boleto:</span> <span class="contract-value">R$ ${data.parcelamentoFabrica || '—'}</span></p>
      <p><span class="contract-label">Parc. bancário/cartão:</span> <span class="contract-value">${data.parcelamentoBancario || '—'}</span></p>
    </div>
    <div class="contract-section">
      <p class="clause-title">Dados para depósito</p>
      <p>Comfort Ind. Com. Ltda – Banco Santander – 033 | Ag: 0288 | CC: 13008585-0 | PIX: (37) 98825-8793</p>
    </div>
    <div class="contract-section">
      <p class="clause-title">PRAZO DE ENTREGA</p>
      <p><span class="contract-value">${data.prazoEntrega || '—'}</span> úteis, cidade de <span class="contract-value">${data.cidadeEntrega || '—'}</span></p>
      <p><span class="contract-label">Frete:</span> <span class="contract-value">${data.responsavelFrete || '—'}</span></p>
    </div>
    <div class="contract-section">
      <p class="clause-title">OBSERVAÇÕES GERAIS</p>
      <p style="color: var(--color-text-muted); font-style: italic;">Sinal, financiamento, documentação e impostos, foro (Piumhi-MG) — conforme texto integral no PDF.</p>
    </div>
    <div class="signature-area">
      <p>Capitólio, ${data.dataContrato || '______ de _____________ de ________'}</p>
      <br>
      <p>VENDEDOR _________________________ &nbsp;&nbsp;&nbsp; COMPRADOR(A) _________________________</p>
    </div>
  `;
};
