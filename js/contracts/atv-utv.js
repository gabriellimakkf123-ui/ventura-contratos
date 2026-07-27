/**
 * Template de Contrato ATV/UTV/BRAT/EVO GRUNT
 * Ventura Experience LTDA
 * Baseado no modelo: CONTRATO COMPRA E VENDA LOJA.docx.pdf
 */

window.VenturaContracts = window.VenturaContracts || {};

window.VenturaContracts.atvUtv = function(data) {
  const tipoLabel = data.tipo || 'ATV/UTV/BRAT/EVO GRUNT';

  return [
    // --- TÍTULO ---
    {
      text: `CONTRATO DE COMPRA E VENDA DE ${tipoLabel}`,
      bold: true,
      size: 14,
      align: 'center',
      spaceAfter: 8
    },
    // --- INTRODUÇÃO ---
    {
      text: 'Pelo presente instrumento particular de COMPRA E VENDA, de um lado:',
      size: 10,
      spaceAfter: 6
    },
    // --- VENDEDORA ---
    {
      text: 'VENDEDORA',
      bold: true,
      size: 11,
      spaceAfter: 2
    },
    {
      text: 'Razão Social: Ventura Experience LTDA',
      size: 10,
      spaceAfter: 1
    },
    {
      text: 'CNPJ: 28.094.088/0001-77',
      size: 10,
      spaceAfter: 1
    },
    {
      text: 'Endereço: Avenida Luiz Eduardo Toledo Prado, 900 - Loja L2092 – Vila do Golf – Ribeirão Preto - SP',
      size: 10,
      spaceAfter: 6
    },
    // --- COMPRADOR ---
    {
      text: 'COMPRADOR',
      bold: true,
      size: 11,
      spaceAfter: 2
    },
    {
      text: `Nome completo: ${data.nome || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `CPF/CNPJ: ${data.cpfCnpj || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `RG/IE: ${data.rgIe || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Rua: ${data.rua || '_______________'}  N°: ${data.numero || '____'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Bairro: ${data.bairro || '_______________'}  Complemento: ${data.complemento || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Cidade: ${data.cidade || '_______________'}  UF: ${data.uf || '____'}  CEP: ${data.cep || '___________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Telefone / WhatsApp: ${data.telefone || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `E-mail: ${data.email || '_______________'}`,
      size: 10,
      spaceAfter: 6
    },
    {
      text: 'As partes acima identificadas têm entre si justo e contratado o que segue:',
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 1 ---
    {
      text: 'CLÁUSULA 1ª – DO OBJETO',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'O presente contrato tem como objeto a compra e venda do seguinte bem:',
      size: 10,
      spaceAfter: 3
    },
    {
      text: `Tipo: ${data.tipo || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Marca: ${data.marca || 'VENTURA'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Modelo: ${data.modelo || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Cor: ${data.cor || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Chassi / Série: ${data.chassi || '_______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Observação: Veículo ${data.origem === 'SHOWROOM' ? 'disponível no SHOWROOM' : 'vindo de FÁBRICA'}`,
      size: 10,
      bold: true,
      spaceAfter: 1
    },
    {
      text: `Itens inclusos: ${data.itensInclusos || 'TODOS OS ITENS DE SÉRIE'}`,
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 2 ---
    {
      text: 'CLÁUSULA 2ª – DO VALOR TOTAL',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `O valor total da venda é de ${data.valorTotal || 'R$ _______________'}, conforme condições abaixo.`,
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 3 ---
    {
      text: 'CLÁUSULA 3ª – DA FORMA DE PAGAMENTO',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'O pagamento será realizado da seguinte forma:',
      size: 10,
      spaceAfter: 3
    },
    {
      text: `Sinal / Entrada: ${data.sinalEntrada || 'R$ _______________'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Saldo restante: ${data.saldoRestante || '_______________'}`,
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 4 ---
    {
      text: 'CLÁUSULA 4ª – DO SINAL',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'O valor pago a título de sinal possui natureza de arras confirmatórias, nos termos do Código Civil, e destina-se a cobrir custos administrativos, operacionais, reserva do bem, indisponibilização para venda a terceiros e demais despesas decorrentes da formalização do negócio.',
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Em caso de desistência imotivada por parte do COMPRADOR, o valor pago a título de sinal não será devolvido, a título de compensação pelos custos já incorridos pela VENDEDORA.',
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 5 ---
    {
      text: 'CLÁUSULA 5ª – DO PRAZO DE ENTREGA',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `A entrega do bem ocorrerá em até ${data.prazoEntrega || '[15]'} dias úteis, contados a partir da confirmação do pagamento do sinal ou aprovação do crédito, quando aplicável.`,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Parágrafo único: O prazo poderá ser prorrogado em casos de atraso de fornecedores, logística, transporte, greves ou força maior, sem caracterizar inadimplemento da VENDEDORA.',
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 6 ---
    {
      text: 'CLÁUSULA 6ª – DO LOCAL E TRANSPORTE',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: `Local de entrega: ${data.localEntrega || 'Ribeirão Preto'}`,
      size: 10,
      spaceAfter: 1
    },
    {
      text: `Responsável pelo transporte: ${data.responsavelTransporte || '( ) VENDEDORA   ( ) COMPRADOR'}`,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Após a entrega, a guarda e responsabilidade pelo bem passam a ser exclusivamente do COMPRADOR.',
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 7 ---
    {
      text: 'CLÁUSULA 7ª – DA RESCISÃO',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'O presente contrato poderá ser rescindido em caso de:',
      size: 10,
      spaceAfter: 2
    },
    {
      text: '• Inadimplência',
      size: 10,
      spaceAfter: 1
    },
    {
      text: '• Descumprimento de cláusulas contratuais',
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Em caso de rescisão por culpa do COMPRADOR, não haverá devolução do sinal pago.',
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 8 ---
    {
      text: 'CLÁUSULA 8ª – DA DEVOLUÇÃO E TROCA',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Não será aceita devolução ou troca do bem após a entrega, salvo nos casos expressamente previstos em lei.',
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 9 ---
    {
      text: 'CLÁUSULA 9ª – DAS DISPOSIÇÕES GERAIS',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'O COMPRADOR declara estar ciente de que as condições técnicas do bem, orientações de uso, responsabilidades do cliente e demais informações operacionais constam em documento próprio denominado TERMO DE ENTREGA TÉCNICA E RESPONSABILIDADES, o qual será apresentado e assinado no ato da entrega.',
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'O referido termo complementa o presente contrato, sem substituí-lo.',
      size: 10,
      spaceAfter: 8
    },
    // --- CLÁUSULA 10 ---
    {
      text: 'CLÁUSULA 10ª – DO FORO',
      bold: true,
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Fica eleito o foro da comarca de Ribeirão Preto – SP renunciando as partes a qualquer outro, por mais privilegiado que seja.',
      size: 10,
      spaceAfter: 4
    },
    {
      text: 'E, por estarem justas e contratadas, as partes assinam o presente instrumento.',
      size: 10,
      spaceAfter: 10
    },
    // --- DATA E ASSINATURAS ---
    {
      text: `Ribeirão Preto, ${data.dataContrato || '____/____/________'}`,
      size: 10,
      align: 'left',
      spaceAfter: 20
    },
    {
      text: 'VENDEDOR(A): ______________________________________',
      size: 10,
      spaceAfter: 3
    },
    {
      text: 'Ventura Experience LTDA',
      size: 9,
      spaceAfter: 15
    },
    {
      text: 'COMPRADOR: ______________________________________',
      size: 10,
      spaceAfter: 3
    },
    {
      text: `${data.nome || ''}`,
      size: 9,
      spaceAfter: 0
    }
  ];
};

/**
 * Gera o texto de preview (HTML) do contrato ATV/UTV
 */
window.VenturaContracts.atvUtvPreview = function(data) {
  const tipoLabel = data.tipo || 'ATV/UTV/BRAT/EVO GRUNT';
  return `
    <h3>CONTRATO DE COMPRA E VENDA DE ${tipoLabel}</h3>
    <div class="contract-section">
      <p>Pelo presente instrumento particular de <strong>COMPRA E VENDA</strong>, de um lado:</p>
    </div>
    <div class="contract-section">
      <p class="clause-title">VENDEDORA</p>
      <p><span class="contract-label">Razão Social:</span> Ventura Experience LTDA</p>
      <p><span class="contract-label">CNPJ:</span> 28.094.088/0001-77</p>
      <p><span class="contract-label">Endereço:</span> Av. Luiz Eduardo Toledo Prado, 900 - Loja L2092 – Vila do Golf – Ribeirão Preto - SP</p>
    </div>
    <div class="contract-section">
      <p class="clause-title">COMPRADOR</p>
      <p><span class="contract-label">Nome:</span> <span class="contract-value">${data.nome || '—'}</span></p>
      <p><span class="contract-label">CPF/CNPJ:</span> <span class="contract-value">${data.cpfCnpj || '—'}</span></p>
      <p><span class="contract-label">RG/IE:</span> <span class="contract-value">${data.rgIe || '—'}</span></p>
      <p><span class="contract-label">Endereço:</span> <span class="contract-value">${data.rua || '—'}, ${data.numero || '—'} - ${data.bairro || '—'} ${data.complemento ? '/ ' + data.complemento : ''}</span></p>
      <p><span class="contract-label">Cidade/UF:</span> <span class="contract-value">${data.cidade || '—'} - ${data.uf || '—'} | CEP: ${data.cep || '—'}</span></p>
      <p><span class="contract-label">Tel/WhatsApp:</span> <span class="contract-value">${data.telefone || '—'}</span></p>
      <p><span class="contract-label">E-mail:</span> <span class="contract-value">${data.email || '—'}</span></p>
    </div>
    <div class="contract-section">
      <p class="clause-title">CLÁUSULA 1ª – DO OBJETO</p>
      <p><span class="contract-label">Tipo:</span> <span class="contract-value">${data.tipo || '—'}</span> | <span class="contract-label">Marca:</span> <span class="contract-value">${data.marca || 'VENTURA'}</span></p>
      <p><span class="contract-label">Modelo:</span> <span class="contract-value">${data.modelo || '—'}</span> | <span class="contract-label">Cor:</span> <span class="contract-value">${data.cor || '—'}</span></p>
      <p><span class="contract-label">Chassi:</span> <span class="contract-value">${data.chassi || '—'}</span></p>
      <p><span class="contract-label">Origem:</span> <span class="contract-value" style="font-weight:700; color: ${data.origem === 'SHOWROOM' ? 'var(--color-success)' : 'var(--color-accent)'}">${data.origem === 'SHOWROOM' ? '🏬 Disponível no Showroom' : '🏭 Vindo da Fábrica'}</span></p>
      <p><span class="contract-label">Itens:</span> <span class="contract-value">${data.itensInclusos || 'TODOS OS ITENS DE SÉRIE'}</span></p>
    </div>
    <div class="contract-section">
      <p class="clause-title">CLÁUSULA 2ª – DO VALOR TOTAL</p>
      <p>Valor total: <span class="contract-value">${data.valorTotal || '—'}</span></p>
    </div>
    <div class="contract-section">
      <p class="clause-title">CLÁUSULA 3ª – DA FORMA DE PAGAMENTO</p>
      <p><span class="contract-label">Sinal/Entrada:</span> <span class="contract-value">${data.sinalEntrada || '—'}</span></p>
      <p><span class="contract-label">Saldo restante:</span> <span class="contract-value">${data.saldoRestante || '—'}</span></p>
    </div>
    <div class="contract-section">
      <p class="clause-title">Cláusulas 4ª a 10ª</p>
      <p style="color: var(--color-text-muted); font-style: italic;">Sinal (arras confirmatórias), prazo de entrega (${data.prazoEntrega || '15'} dias úteis), local de entrega (${data.localEntrega || 'Ribeirão Preto'}), transporte (${data.responsavelTransporte || '—'}), rescisão, devolução, disposições gerais e foro (Ribeirão Preto – SP) — conforme texto integral no PDF.</p>
    </div>
    <div class="signature-area">
      <p>Ribeirão Preto, ${data.dataContrato || '____/____/________'}</p>
      <br>
      <p>VENDEDOR(A) _________________________ &nbsp;&nbsp;&nbsp; COMPRADOR _________________________</p>
    </div>
  `;
};
