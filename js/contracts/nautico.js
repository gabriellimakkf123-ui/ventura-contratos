/**
 * Template de Contrato de Embarcação Náutica
 * Vendedora: Comfort Ind e Comércio LTDA
 * Baseado no modelo: MODELO CONTRATO DE COMPRA E VENDA.docx.pdf
 */

window.VenturaContracts = window.VenturaContracts || {};

function parseBoletoLinesPDF(parcelamentoText) {
  if (!parcelamentoText || !parcelamentoText.trim()) return [];
  const lines = parcelamentoText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 1) {
    return [{
      text: `Parcelamento boleto: ${lines[0]}`,
      size: 10,
      spaceAfter: 2
    }];
  }
  
  const blocks = [
    {
      text: 'Parcelamento boleto (fábrica):',
      bold: true,
      size: 10,
      spaceAfter: 2
    }
  ];
  
  lines.forEach(line => {
    blocks.push({
      text: `   • ${line}`,
      size: 9.5,
      spaceAfter: 1.5
    });
  });
  
  return blocks;
}

window.VenturaContracts.nautico = function(data) {
  // Construção do bloco do comprador sem repetições
  let compradorText = `COMPRADOR(A): ${data.nome || '_______________'}, inscrito(a) no CPF/CNPJ sob o nº ${data.cpf || '_______________'}`;
  if (data.rg) compradorText += `, RG ${data.rg}`;
  if (data.endereco) compradorText += `, residente e domiciliado(a) à ${data.endereco}`;
  if (data.telefone) compradorText += `, telefone ${data.telefone}`;
  if (data.email) compradorText += `, e-mail ${data.email}`;
  compradorText += `, doravante denominado(a) COMPRADOR(A).`;

  const blocks = [
    // --- TÍTULO ---
    {
      text: 'CONTRATO DE COMPRA E VENDA DE EMBARCAÇÃO NÁUTICA — EDIÇÃO BOAT SHOW',
      bold: true,
      size: 13,
      align: 'center',
      spaceAfter: 4
    },
    ...(data.contratoId ? [{
      text: `PROPOSTA / CONTRATO N°: ${data.contratoId}  |  EVENTO: ${data.evento || 'BOAT SHOW 2026'}${data.aprovadoPor ? `  |  APROVADO POR: ${data.aprovadoPor}` : ''}`,
      bold: true,
      size: 8.5,
      align: 'center',
      spaceAfter: 8
    }] : []),
    // --- VENDEDOR ---
    {
      text: 'VENDEDOR: COMFORT IND E COMÉRCIO LTDA, com sede na Estrada do Morro Preto S/N KM 01, Zona Rural, Capitólio, Estado de Minas Gerais, CEP 37930-000, inscrita no CNPJ/ME sob o N° 10.215.056/0001-17, doravante denominada VENDEDORA.',
      size: 10,
      spaceAfter: 6
    },
    // --- COMPRADOR ---
    {
      text: compradorText,
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
    ...(data.valorSinal ? [{
      text: `Sinal: R$ ${data.valorSinal}`,
      size: 10,
      spaceAfter: 2
    }] : []),
    ...(data.valorEntrada ? [{
      text: `Entrada: R$ ${data.valorEntrada}`,
      size: 10,
      spaceAfter: 2
    }] : []),
    ...(data.permuta ? [{
      text: `Permuta: ${data.permuta}, com todas as manutenções em dia e em bom estado de conservação.`,
      size: 10,
      spaceAfter: 2
    }] : []),
    ...(data.contraEmbarque ? [{
      text: `Contra embarque: R$ ${data.contraEmbarque}`,
      size: 10,
      spaceAfter: 2
    }] : []),
    ...(data.parcelamentoFabrica ? parseBoletoLinesPDF(data.parcelamentoFabrica) : []),
    ...(data.parcelamentoBancario ? [{
      text: `Parcelamento bancário/cartão de crédito: ${data.parcelamentoBancario}`,
      size: 10,
      spaceAfter: 4
    }] : []),
    ...(data.permuta ? [{
      text: '2.1. Em caso de troca ou permuta, o bem ficará em poder da VENDEDORA, a título de garantia real, até sua venda a terceiro adquirente. O valor da venda será utilizado para abatimento parcial do preço deste contrato.',
      size: 10,
      spaceAfter: 5
    }] : []),
    // --- DADOS BANCÁRIOS ---
    {
      text: 'Dados para depósito:',
      bold: true,
      size: 10,
      spaceAfter: 2
    },
    {
      text: 'Banco Santander (033) | Agência: 0288 | Conta Corrente: 13.008.585-0\nFavorecido: Comfort Ind. Com. Ltda | CHAVE PIX (Celular): (37) 98825-8793',
      size: 9.5,
      bold: true,
      spaceAfter: 6
    },
    // --- PRAZO DE ENTREGA ---
    {
      text: 'DO PRAZO E LOCAL DE ENTREGA:',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `O prazo estimado para entrega do bem é de ${data.prazoEntrega || '______'} dias úteis, contados a partir da aprovação e liquidação do sinal/entrada, a ser entregue na cidade de ${data.cidadeEntrega || '_______________'}. Responsável pelo frete: ${data.responsavelFrete || 'VENDEDORA'}.`,
      size: 10,
      spaceAfter: 6
    },
    // --- CLÁUSULAS GERAIS ---
    {
      text: 'CLÁUSULAS GERAIS E DISPOSIÇÕES FINAIS:',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: '1. O descumprimento de qualquer das obrigações assumidas pelas partes sujeitará o infrator a multa compensatória de 10% (dez por cento) sobre o valor total do contrato, além de perdas e danos apurados.',
      size: 9.5,
      spaceAfter: 3
    },
    {
      text: '2. O sinal pago pelo COMPRADOR(A) possui caráter confirmatório da negociação, nos termos dos arts. 417 a 420 do Código Civil Brasileiro.',
      size: 9.5,
      spaceAfter: 3
    },
    {
      text: '3. A propriedade do bem objeto deste contrato somente será transferida definitivamente ao COMPRADOR(A) após a quitação integral do preço ajustado.',
      size: 9.5,
      spaceAfter: 3
    },
    {
      text: '4. Para dirimir quaisquer controvérsias oriundas deste instrumento, as partes elegem o foro da Comarca de Piumhi/MG, com renúncia expressa a qualquer outro, por mais privilegiado que seja.',
      size: 9.5,
      spaceAfter: 12
    },
    // --- ASSINATURAS ---
    {
      text: `Capitólio/MG, ${data.dataContrato || '______ de _____________ de ________.'}`,
      align: 'center',
      size: 10,
      spaceAfter: 20
    },
    {
      text: '________________________________________          ________________________________________',
      align: 'center',
      size: 10,
      spaceAfter: 4
    },
    {
      text: 'COMFORT IND E COMÉRCIO LTDA                              COMPRADOR(A)',
      align: 'center',
      bold: true,
      size: 9.5,
      spaceAfter: 2
    },
    {
      text: `VENDEDORA${data.vendedorNome ? ` (Consultor: ${data.vendedorNome})` : ''}             ${data.assinaturaCliente && data.assinaturaCliente !== 'ASSINATURA_FISICA' ? '[DOCUMENTO ASSINADO DIGITALMENTE]' : '[ASSINATURA DO COMPRADOR]'}`,
      align: 'center',
      size: 8.5,
      spaceAfter: 12
    },
    ...(data.aprovadoPor ? [
      {
        text: `✓ APROVADO PELA DIRETORIA: ${data.aprovadoPor}${data.aprovadoEm ? ` em ${new Date(data.aprovadoEm).toLocaleDateString('pt-BR')} às ${new Date(data.aprovadoEm).toLocaleTimeString('pt-BR')}` : ''}`,
        align: 'center',
        bold: true,
        size: 8.5,
        spaceAfter: 4
      }
    ] : [])
  ];

  return blocks;
};

/**
 * Gera o texto de preview (HTML) do contrato Náutico
 */
window.VenturaContracts.nauticoPreview = function(data) {
  let boletoPreviewHtml = '';
  if (data.parcelamentoFabrica) {
    const lines = data.parcelamentoFabrica.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 1) {
      boletoPreviewHtml = lines.map(l => `<div style="padding-left:12px; font-size:0.9rem;">• ${l}</div>`).join('');
    } else {
      boletoPreviewHtml = `R$ ${lines[0]}`;
    }
  }

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
      <p><span class="contract-label">CPF / CNPJ:</span> <span class="contract-value">${data.cpf || '—'}</span></p>
      ${data.rg ? `<p><span class="contract-label">RG:</span> <span class="contract-value">${data.rg}</span></p>` : ''}
      ${data.endereco ? `<p><span class="contract-label">Endereço:</span> <span class="contract-value">${data.endereco}</span></p>` : ''}
      ${data.telefone ? `<p><span class="contract-label">Telefone:</span> <span class="contract-value">${data.telefone}</span></p>` : ''}
      ${data.email ? `<p><span class="contract-label">E-mail:</span> <span class="contract-value">${data.email}</span></p>` : ''}
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
      ${data.valorSinal ? `<p><span class="contract-label">Sinal:</span> <span class="contract-value">R$ ${data.valorSinal}</span></p>` : ''}
      ${data.valorEntrada ? `<p><span class="contract-label">Entrada:</span> <span class="contract-value">R$ ${data.valorEntrada}</span></p>` : ''}
      ${data.permuta ? `<p><span class="contract-label">Permuta:</span> <span class="contract-value">${data.permuta}</span></p>` : ''}
      ${data.contraEmbarque ? `<p><span class="contract-label">Contra embarque:</span> <span class="contract-value">R$ ${data.contraEmbarque}</span></p>` : ''}
      ${data.parcelamentoFabrica ? `<p><span class="contract-label">Parc. boleto:</span> <span class="contract-value">${boletoPreviewHtml}</span></p>` : ''}
      ${data.parcelamentoBancario ? `<p><span class="contract-label">Parc. bancário/cartão:</span> <span class="contract-value">${data.parcelamentoBancario}</span></p>` : ''}
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
