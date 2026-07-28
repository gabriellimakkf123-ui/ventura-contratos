/**
 * Ventura App - Lógica Principal com Validação Interativa e Preenchimento Rápido
 * Direct Global API binding for 100% Failsafe Browser Execution
 */

(function() {
  'use strict';

  // ---- Estado da aplicação ----
  let currentCategory = null;

  // ---- Elementos DOM ----
  const DOM = {
    categoryCards: null,
    formContainers: null,
    previewPanel: null,
    previewContent: null,
    toast: null
  };

  // ---- Inicialização ----
  function init() {
    try {
      DOM.categoryCards = document.querySelectorAll('.category-card');
      DOM.formContainers = document.querySelectorAll('.form-container');
      DOM.previewPanel = document.getElementById('previewPanel');
      DOM.previewContent = document.getElementById('previewContent');
      DOM.toast = document.getElementById('toast');

      // Aplicar máscaras de input
      setupInputMasks();

      // Preencher data atual
      setTodayDate();

      // Auto-selecionar 'nautico' por padrão para o formulário já abrir aberto e pronto
      selectCategory('nautico');

      // Inicializar Configurador de Embarcações Ventura
      initBoatConfigurator();
    } catch (e) {
      console.error('Erro na inicialização:', e);
    }
  }

  // ---- Seleção de Categoria ----
  function selectCategory(category) {
    try {
      currentCategory = category;

      // Ocultar empty state
      const emptyState = document.getElementById('emptyState');
      if (emptyState) {
        emptyState.style.display = 'none';
      }

      // Atualizar cards
      const cards = document.querySelectorAll('.category-card');
      cards.forEach(function(card) {
        if (card.dataset.category === category) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      // Mostrar/ocultar formulários instantaneamente
      const containers = document.querySelectorAll('.form-container');
      containers.forEach(function(container) {
        if (container.id === 'form-' + category) {
          container.classList.add('visible');
          container.style.display = 'block';
        } else {
          container.classList.remove('visible');
          container.style.display = 'none';
        }
      });

      // Ocultar preview e caixas de validação ao trocar
      hidePreview();
      hideValidationBox('atv');
      hideValidationBox('nautico');

      // Rolar até o formulário selecionado
      const targetForm = document.getElementById('form-' + category);
      if (targetForm) {
        targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      console.error('Erro ao selecionar categoria:', e);
      alert('Erro ao trocar de categoria: ' + e.message);
    }
  }

  // ---- Máscaras de Input ----
  function setupInputMasks() {
    // CPF: 000.000.000-00
    document.querySelectorAll('[data-mask="cpf"]').forEach(function(input) {
      input.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 9) {
          v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        } else if (v.length > 6) {
          v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (v.length > 3) {
          v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        this.value = v;
      });
    });

    // CPF/CNPJ: detecta automaticamente
    document.querySelectorAll('[data-mask="cpfcnpj"]').forEach(function(input) {
      input.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 14) v = v.slice(0, 14);
        if (v.length > 11) {
          v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
        } else if (v.length > 9) {
          v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        } else if (v.length > 6) {
          v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (v.length > 3) {
          v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        this.value = v;
      });
    });

    // Telefone: (00) 00000-0000
    document.querySelectorAll('[data-mask="telefone"]').forEach(function(input) {
      input.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) {
          v = v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
        } else if (v.length > 2) {
          v = v.replace(/(\d{2})(\d{1,5})/, '($1) $2');
        }
        this.value = v;
      });
    });

    // CEP: 00000-000
    document.querySelectorAll('[data-mask="cep"]').forEach(function(input) {
      input.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length > 5) {
          v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        }
        this.value = v;
      });
    });

    // Moeda: R$ 0.000,00
    document.querySelectorAll('[data-mask="moeda"]').forEach(function(input) {
      input.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        if (v === '') { this.value = ''; return; }
        v = (parseInt(v, 10) / 100).toFixed(2);
        v = v.replace('.', ',');
        v = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.value = 'R$ ' + v;
      });
    });
  }

  // ---- Data Atual ----
  function setTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateStr = day + '/' + month + '/' + year;

    document.querySelectorAll('[data-default="today"]').forEach(function(input) {
      input.value = dateStr;
    });
  }

  // ---- Coleta de Dados ----
  function collectFormData(category) {
    if (category === 'atv') {
      return {
        nome: val('atv-nome'),
        cpfCnpj: val('atv-cpfcnpj'),
        rgIe: val('atv-rgie'),
        rua: val('atv-rua'),
        numero: val('atv-numero'),
        bairro: val('atv-bairro'),
        complemento: val('atv-complemento'),
        cidade: val('atv-cidade'),
        uf: val('atv-uf'),
        cep: val('atv-cep'),
        telefone: val('atv-telefone'),
        email: val('atv-email'),
        tipo: val('atv-tipo'),
        marca: val('atv-marca'),
        modelo: val('atv-modelo'),
        cor: val('atv-cor'),
        chassi: val('atv-chassi'),
        origem: val('atv-origem'),
        itensInclusos: val('atv-itens'),
        valorTotal: val('atv-valor-total'),
        sinalEntrada: val('atv-sinal'),
        saldoRestante: val('atv-saldo'),
        prazoEntrega: val('atv-prazo'),
        localEntrega: val('atv-local-entrega'),
        responsavelTransporte: val('atv-responsavel'),
        dataContrato: val('atv-data')
      };
    } else if (category === 'nautico') {
      return {
        nome: val('naut-nome'),
        cpf: val('naut-cpf'),
        rg: val('naut-rg'),
        endereco: val('naut-endereco'),
        telefone: val('naut-telefone'),
        email: val('naut-email'),
        modeloBarco: val('naut-modelo'),
        corCasco: val('naut-cor-casco'),
        corEstofamentos: val('naut-cor-estofamentos'),
        anoModelo: val('naut-ano-modelo'),
        motorizacao: val('naut-motorizacao'),
        origem: val('naut-origem'),
        acessorios: val('naut-acessorios'),
        valorTotal: val('naut-valor-total'),
        valorSinal: val('naut-sinal'),
        valorEntrada: val('naut-entrada'),
        permuta: val('naut-permuta'),
        contraEmbarque: val('naut-contra-embarque'),
        parcelamentoFabrica: val('naut-parc-fabrica'),
        parcelamentoBancario: val('naut-parc-bancario'),
        prazoEntrega: val('naut-prazo'),
        cidadeEntrega: val('naut-cidade-entrega'),
        responsavelFrete: val('naut-responsavel'),
        dataContrato: val('naut-data')
      };
    }
    return {};
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  // ---- Validação Interativa com Explicitação de Erros ----
  function validateAndExplain(category) {
    let fieldsConfig;
    let boxId, listId;

    if (category === 'atv') {
      boxId = 'valBoxAtv';
      listId = 'valListAtv';
      fieldsConfig = [
        { id: 'atv-nome', label: 'Nome Completo do Comprador', icon: '👤' },
        { id: 'atv-cpfcnpj', label: 'CPF / CNPJ do Comprador', icon: '📄' },
        { id: 'atv-tipo', label: 'Tipo do Veículo (ATV, UTV, BRAT ou EVO)', icon: '🏍️' },
        { id: 'atv-modelo', label: 'Modelo do Veículo', icon: '🏷️' },
        { id: 'atv-valor-total', label: 'Valor Total da Venda', icon: '💰' }
      ];
    } else {
      boxId = 'valBoxNautico';
      listId = 'valListNautico';
      fieldsConfig = [
        { id: 'naut-nome', label: 'Nome Completo do Comprador', icon: '👤' },
        { id: 'naut-cpf', label: 'CPF / CNPJ do Comprador', icon: '📄' },
        { id: 'naut-modelo', label: 'Modelo da Embarcação (ex: V195, V240)', icon: '🚤' },
        { id: 'naut-valor-total', label: 'Valor Total da Embarcação', icon: '💰' }
      ];
    }

    const missingFields = [];

    // Limpar marcações de erro anteriores
    const formId = category === 'atv' ? 'formAtv' : 'formNautico';
    const formEl = document.getElementById(formId);
    if (formEl) {
      formEl.querySelectorAll('.form-group.error').forEach(function(g) {
        g.classList.remove('error');
      });
    }

    // Verificar cada campo obrigatório
    fieldsConfig.forEach(function(f) {
      const input = document.getElementById(f.id);
      if (!input || !input.value.trim()) {
        missingFields.push(f);
        if (input) {
          input.closest('.form-group').classList.add('error');
        }
      }
    });

    const boxEl = document.getElementById(boxId);
    const listEl = document.getElementById(listId);

    if (missingFields.length > 0) {
      let html = '';
      missingFields.forEach(function(m) {
        html += `<li>${m.icon} <strong>${m.label}</strong> é um campo obrigatório.</li>`;
      });

      if (listEl) listEl.innerHTML = html;
      if (boxEl) boxEl.classList.add('visible');

      showToast('⚠️ Faltam campos obrigatórios! Veja o aviso abaixo.', 'error');
      return false;
    } else {
      if (boxEl) boxEl.classList.remove('visible');
      return true;
    }
  }

  function hideValidationBox(category) {
    const boxId = category === 'atv' ? 'valBoxAtv' : 'valBoxNautico';
    const boxEl = document.getElementById(boxId);
    if (boxEl) boxEl.classList.remove('visible');
  }

  // ---- Preenchimento Rápido (Dados de Teste) ----
  function quickFillSampleData(category) {
    try {
      if (category === 'atv') {
        setVal('atv-nome', 'Carlos Eduardo Silva');
        setVal('atv-cpfcnpj', '123.456.789-00');
        setVal('atv-rgie', 'MG-14.852.963');
        setVal('atv-rua', 'Av. Luiz Eduardo Toledo Prado');
        setVal('atv-numero', '900');
        setVal('atv-bairro', 'Vila do Golf');
        setVal('atv-complemento', 'Apto 204');
        setVal('atv-cidade', 'Ribeirão Preto');
        setVal('atv-uf', 'SP');
        setVal('atv-cep', '14025-000');
        setVal('atv-telefone', '(16) 99876-5432');
        setVal('atv-email', 'carlos.eduardo@email.com');
        setVal('atv-tipo', 'ATV');
        setVal('atv-marca', 'VENTURA');
        setVal('atv-modelo', 'LAND FORCE 650');
        setVal('atv-cor', 'Laranja Ventura');
        setVal('atv-chassi', 'VF8650-2026-X987');
        setVal('atv-origem', 'SHOWROOM');
        setVal('atv-itens', 'TODOS OS ITENS DE SÉRIE + Guincho elétrico 3000lbs e protetor de mão');
        setVal('atv-valor-total', 'R$ 75.000,00');
        setVal('atv-sinal', 'R$ 10.000,00');
        setVal('atv-saldo', 'R$ 65.000,00 em 10x sem juros no cartão');
        setVal('atv-prazo', '15');
        setVal('atv-local-entrega', 'Ribeirão Preto');
        setVal('atv-responsavel', 'VENDEDORA');
      } else if (category === 'nautico') {
        setVal('naut-nome', 'Roberto Albuquerque');
        setVal('naut-cpf', '987.654.321-11');
        setVal('naut-rg', 'MG-9.876.543');
        setVal('naut-endereco', 'Alameda dos Ancoradouros, 45, Bairro Morro Preto, Capitólio/MG - CEP 37.930-000');
        setVal('naut-telefone', '(37) 99123-4567');
        setVal('naut-email', 'roberto.albuquerque@email.com');
        setVal('naut-modelo', 'V240 Premium');
        setVal('naut-cor-casco', 'Azul Marinho e Branco');
        setVal('naut-cor-estofamentos', 'Caramelo Nobre');
        setVal('naut-ano-modelo', '2026/2026');
        setVal('naut-motorizacao', 'Mercury 200HP V6 4-Stroke');
        setVal('naut-origem', 'FÁBRICA');
        setVal('naut-acessorios', 'Som bluetooth marinizado com amplificador, Guincho elétrico com 50m de corrente, Piso EVA náutico cinza, Capa de proteção e Carreta de encalhe');
        setVal('naut-valor-total', 'R$ 290.000,00');
        setVal('naut-sinal', 'R$ 30.000,00');
        setVal('naut-entrada', 'R$ 60.000,00');
        setVal('naut-permuta', '');
        setVal('naut-contra-embarque', 'R$ 130.000,00');
        setVal('naut-gen-valor', 'R$ 10.000,00');
        setVal('naut-gen-dia', '25');
        setVal('naut-gen-inicio', '08/2026');
        setVal('naut-gen-fim', '02/2027');
        setVal('naut-parc-fabrica', '1ª Parcela: R$ 10.000,00 — Vencimento: 25/08/2026\n2ª Parcela: R$ 10.000,00 — Vencimento: 25/09/2026\n3ª Parcela: R$ 10.000,00 — Vencimento: 25/10/2026\n4ª Parcela: R$ 10.000,00 — Vencimento: 25/11/2026\n5ª Parcela: R$ 10.000,00 — Vencimento: 25/12/2026\n6ª Parcela: R$ 10.000,00 — Vencimento: 25/01/2027\n7ª Parcela: R$ 10.000,00 — Vencimento: 25/02/2027');
        setVal('naut-parc-bancario', '');
        setVal('naut-prazo', '30 dias úteis');
        setVal('naut-cidade-entrega', 'Capitólio/MG');
        setVal('naut-responsavel', 'VENDEDORA');
      }

      hideValidationBox(category);
      showToast('⚡ Dados de exemplo preenchidos com sucesso!', 'success');
    } catch (e) {
      console.error('Erro no quickFill:', e);
      alert('Erro no preenchimento: ' + e.message);
    }
  }

  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) {
      el.value = value;
      try {
        const evInput = document.createEvent('Event');
        evInput.initEvent('input', true, true);
        el.dispatchEvent(evInput);

        const evChange = document.createEvent('Event');
        evChange.initEvent('change', true, true);
        el.dispatchEvent(evChange);
      } catch (e) {}
    }
  }

  // ---- Preview ----
  function showPreview(category) {
    try {
      validateAndExplain(category);

      const data = collectFormData(category);
      let html = '';

      if (category === 'atv') {
        html = window.VenturaContracts.atvUtvPreview(data);
      } else {
        html = window.VenturaContracts.nauticoPreview(data);
      }

      const pPanel = document.getElementById('previewPanel');
      const pContent = document.getElementById('previewContent');

      if (pContent) pContent.innerHTML = html;
      if (pPanel) {
        pPanel.classList.add('visible');
        setTimeout(function() {
          pPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (e) {
      console.error('Erro ao exibir preview:', e);
      alert('Erro na pré-visualização: ' + e.message);
    }
  }

  function hidePreview() {
    const pPanel = document.getElementById('previewPanel');
    if (pPanel) {
      pPanel.classList.remove('visible');
    }
  }

  // ---- Gerar PDF ----
  function generatePDF(category) {
    try {
      const allFilled = validateAndExplain(category);

      const data = collectFormData(category);
      let blocks, filename;

      if (category === 'atv') {
        blocks = window.VenturaContracts.atvUtv(data);
        const tipoSlug = (data.tipo || 'ATV').replace(/\s+/g, '_');
        const nomeSlug = (data.nome || 'cliente').replace(/\s+/g, '_').substring(0, 30);
        filename = 'Contrato_' + tipoSlug + '_' + nomeSlug + '.pdf';
      } else {
        blocks = window.VenturaContracts.nautico(data);
        const nomeSlug = (data.nome || 'cliente').replace(/\s+/g, '_').substring(0, 30);
        filename = 'Contrato_Nautico_' + nomeSlug + '.pdf';
      }

      if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast('❌ Biblioteca jsPDF não encontrada.', 'error');
        alert('Biblioteca jsPDF não foi carregada no navegador.');
        return;
      }

      window.VenturaPDF.generate(blocks, filename, category);
      
      if (allFilled) {
        showToast('✅ Contrato PDF gerado com sucesso!', 'success');
      } else {
        showToast('📄 Contrato PDF gerado! (Campos vazios ficaram em branco)', 'success');
      }
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      alert('Ocorreu um erro ao gerar o PDF: ' + e.message);
      showToast('❌ Erro ao gerar o PDF: ' + e.message, 'error');
    }
  }

  // ---- Limpar Formulário ----
  function clearForm(formId) {
    try {
      const form = document.getElementById(formId);
      if (!form) return;

      form.querySelectorAll('input, select, textarea').forEach(function(el) {
        if (el.type === 'select-one') {
          el.selectedIndex = 0;
        } else if (el.dataset.default === 'today') {
          // Manter data
        } else if (el.dataset.prefill) {
          el.value = el.dataset.prefill;
        } else {
          el.value = '';
        }
      });

      form.querySelectorAll('.form-group.error').forEach(function(g) {
        g.classList.remove('error');
      });

      const category = formId === 'formAtv' ? 'atv' : 'nautico';
      hideValidationBox(category);
      hidePreview();
      showToast('🧹 Formulário limpo', 'success');
    } catch (e) {
      console.error('Erro ao limpar formulário:', e);
    }
  }

  // ---- Gerador Automático de Parcelas de Boleto ----
  function generateBoletoSchedule(category) {
    try {
      const prefix = category === 'atv' ? 'atv' : 'naut';
      const valor = val(prefix + '-gen-valor');
      const dia = val(prefix + '-gen-dia') || '25';
      const inicio = val(prefix + '-gen-inicio') || '08/2026';
      const fim = val(prefix + '-gen-fim') || '02/2027';

      if (!valor) {
        showToast('⚠️ Por favor, informe o valor mensal da parcela.', 'error');
        alert('Informe o valor mensal da parcela para gerar os vencimentos.');
        return;
      }

      const startParts = inicio.split('/');
      const endParts = fim.split('/');

      if (startParts.length < 2 || endParts.length < 2) {
        showToast('⚠️ Formato de mês/ano inválido. Use MM/AAAA (ex: 08/2026).', 'error');
        alert('Formato de mês/ano inválido. Use o formato MM/AAAA (ex: 08/2026 e 02/2027).');
        return;
      }

      let mStart = parseInt(startParts[0], 10);
      let yStart = parseInt(startParts[1], 10);
      let mEnd = parseInt(endParts[0], 10);
      let yEnd = parseInt(endParts[1], 10);

      const diaNum = String(parseInt(dia, 10) || 25).padStart(2, '0');

      let currentMonth = mStart;
      let currentYear = yStart;
      let count = 1;
      let lines = [];

      while (true) {
        let mStr = String(currentMonth).padStart(2, '0');
        let dateStr = `${diaNum}/${mStr}/${currentYear}`;
        lines.push(`${count}ª Parcela: ${valor} — Vencimento: ${dateStr}`);

        if (currentMonth === mEnd && currentYear === yEnd) {
          break;
        }

        count++;
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }

        if (count > 60) break;
      }

      const resultText = lines.join('\n');
      setVal(prefix + '-parc-fabrica', resultText);
      showToast(`⚡ ${count} parcelas de boleto geradas com sucesso!`, 'success');
    } catch (e) {
      console.error('Erro ao gerar parcelas de boleto:', e);
      alert('Erro ao gerar parcelas: ' + e.message);
    }
  }

  // ---- Toast ----
  function showToast(message, type) {
    const toastEl = document.getElementById('toast');
    if (!toastEl) return;

    toastEl.textContent = message;
    toastEl.className = 'toast ' + (type === 'error' ? 'error' : '');

    void toastEl.offsetWidth;
    toastEl.classList.add('visible');

    setTimeout(function() {
      toastEl.classList.remove('visible');
    }, 4000);
  }

  // ==================== DADOS DOS MODELOS E ACESSÓRIOS VENTURA ====================
  const COMFORT_MODELS = [
    'V195 Comfort - NEW',
    'V205 CROSSOVER',
    'V210 Comfort',
    'V215 Cabin Comfort',
    'V220 SURF',
    'V230 GII Comfort',
    'V250 Comfort',
    'V250 Sport',
    'V265 Cabin Comfort',
    'V300 Crossover',
    'V300 Day Cruiser'
  ];

  const PREMIUM_MODELS = [
    'V370 Crossover',
    'V400 CROSSOVER PREMIUM',
    'V400 HT PREMIUM',
    'V450 FLY PREMIUM',
    'V550 Crossover',
    'V550 FLY BRIDGE'
  ];

  const PONTOON_MODELS = [
    'IRON 25',
    'IRON 32',
    'Pontoon 250',
    'Pontoon 320'
  ];

  const VENTURA_MODELS_DATA = {
    'V195 Comfort - NEW': {
      model: 'V195 Comfort - NEW',
      linha: 'Linha Comfort',
      conjuntos: [
        { id: 'c1', title: 'V195 = Casco + Montagem + F90 CETL 4T', motor: 'F90 CETL 4T', price: 149900 },
        { id: 'c2', title: 'V195 = Casco + Montagem + F115 BETL 4T', motor: 'F115 BETL 4T', price: 159990 },
        { id: 'c3', title: 'V195 = Casco + Montagem + 100 ELPT 4T', motor: '100 ELPT 4T', price: 174900 },
        { id: 'c4', title: 'V195 = Casco + Montagem + F150 DETL 4T', motor: 'F150 DETL 4T', price: 179990 },
        { id: 'c5', title: 'V195 = Casco + Montagem + 115 ELPT 4T', motor: '115 ELPT 4T', price: 187900 }
      ],
      acessorios: {
        opcionaisSugeridos: [
          { id: 'acc_1', name: 'Buzina de Corneta Simples', price: 590 },
          { id: 'acc_2', name: 'Porta-Varas (2)', price: 640 },
          { id: 'acc_3', name: 'Sistema de Som (01 CD Player, 04 Alto-Falantes, 01 Antena, 01 Bolha)', price: 1800 },
          { id: 'acc_4', name: 'Ventura System', price: 14900 },
          { id: 'acc_5', name: 'Tomada 12 Volts', price: 195 },
          { id: 'acc_6', name: 'Capota V195 NEW', price: 1980 },
          { id: 'acc_7', name: 'Buzina de Embutir', price: 450 },
          { id: 'acc_8', name: 'Bússola', price: 290 },
          { id: 'acc_9', name: 'Marcador de Combustível', price: 1650 },
          { id: 'acc_10', name: 'Sistema de Direção Hidráulica - para versão Popa', price: 10900 },
          { id: 'acc_11', name: 'Suporte de defensas (2 Pares) (V195, V205, V210, V215, V220)', price: 320 },
          { id: 'acc_12', name: 'GPS 5', price: 5500 },
          { id: 'acc_13', name: 'Defensas G3 (2 unidades) (V195, V205, V210, V215, V220)', price: 380 },
          { id: 'acc_14', name: 'Radio VHF com antena e suporte', price: 3200 },
          { id: 'acc_15', name: 'GPS 7', price: 7950 }
        ],
        kitsPremium: [
          { id: 'acc_16', name: 'Kit Eva', price: 4700 },
          { id: 'acc_17', name: 'Kit Salvatagem (08 COLETES CLASSE V, 01 ANCORA DF 400, 50 MTS DE CABO, 01 BAND. BRASIL, 01 APITO, 01 EXTINTOR, 01 SUP. DE BOIA NÁUTICA)', price: 3070 },
          { id: 'acc_18', name: 'Kit churrasqueira (churrasqueira, suporte e pedestal)', price: 4100 }
        ],
        opcionaisServico: [
          { id: 'acc_19', name: 'Carreta Rodoviária de Metal V195 e V205', price: 17200 },
          { id: 'acc_20', name: 'Lona de cobertura ripstop cor prata', price: 2980 },
          { id: 'acc_21', name: 'Carreta rodo encalhe de madeira', price: 11900 }
        ]
      }
    },

    'V205 CROSSOVER': {
      model: 'V205 CROSSOVER',
      linha: 'Linha Comfort',
      conjuntos: [
        { id: 'v205_c1', title: 'V205 CROSS = Casco + Montagem + F115 BETL 4T Yamaha', motor: 'F115 BETL 4T Yamaha', price: 217500 },
        { id: 'v205_c2', title: 'V205 CROSS = Casco + Montagem + F150 DETL 4T Yamaha', motor: 'F150 DETL 4T Yamaha', price: 239900 },
        { id: 'v205_c3', title: 'V205 CROSS = Casco + Montagem + 115 ELPT 4T Mercury', motor: '115 ELPT 4T Mercury', price: 249900 }
      ],
      acessorios: {
        opcionaisSugeridos: [
          { id: 'v205_acc_1', name: 'Sistema de Som (01 CD Player, 04 Alto-Falantes, 01 Antena, 01 Bolha)', price: 1800 },
          { id: 'v205_acc_2', name: 'Buzina de Embutir', price: 450 },
          { id: 'v205_acc_3', name: 'Capota V205 barco com Targa', price: 4900 },
          { id: 'v205_acc_4', name: 'Porta-Varas (2)', price: 640 },
          { id: 'v205_acc_5', name: 'Ventura System', price: 14900 },
          { id: 'v205_acc_6', name: 'Tomada 12 Volts', price: 195 },
          { id: 'v205_acc_7', name: 'Buzina de Corneta Simples', price: 590 },
          { id: 'v205_acc_8', name: 'Capota V205', price: 2800 },
          { id: 'v205_acc_9', name: 'Bússola', price: 290 },
          { id: 'v205_acc_10', name: 'Marcador de Combustível', price: 1650 },
          { id: 'v205_acc_11', name: 'Sistema de Direção Hidráulica - para versão Popa', price: 10900 },
          { id: 'v205_acc_12', name: 'Suporte de defensas (2 Pares) (V195, V205, V210, V215, V220)', price: 320 },
          { id: 'v205_acc_13', name: 'GPS 5', price: 5500 },
          { id: 'v205_acc_14', name: 'Defensas G3 (2 unidades) (V195, V205, V210, V215, V220)', price: 380 },
          { id: 'v205_acc_15', name: 'Radio VHF com antena e suporte', price: 3200 },
          { id: 'v205_acc_16', name: 'GPS 7', price: 7950 }
        ],
        kitsPremium: [
          { id: 'v205_acc_17', name: 'Kit EVA', price: 4890 },
          { id: 'v205_acc_18', name: 'Kit Salvatagem (08 COLETES CLASSE V, 01 ANCORA DF 400, 50 MTS DE CABO, 01 BAND. BRASIL, 01 APITO, 01 EXTINTOR, 01 SUP. DE BOIA NÁUTICA)', price: 3070 },
          { id: 'v205_acc_19', name: 'Kit churrasqueira (churrasqueira, suporte e pedestal)', price: 4100 },
          { id: 'v205_acc_20', name: 'Targa V205', price: 16900 }
        ],
        opcionaisServico: [
          { id: 'v205_acc_21', name: 'Segunda Bateria', price: 1850 },
          { id: 'v205_acc_22', name: 'Carreta Rodoviária de Metal V195 e V205', price: 17200 },
          { id: 'v205_acc_23', name: 'Lona de cobertura V205', price: 3890 },
          { id: 'v205_acc_24', name: 'Carreta rodo encalhe de madeira', price: 11900 }
        ]
      }
    },

    'V210 Comfort': {
      model: 'V210 Comfort',
      linha: 'Linha Comfort',
      conjuntos: [
        { id: 'v210_c1', title: 'V210 = Casco + Montagem + F115 BETL 4T Yamaha', motor: 'F115 BETL 4T Yamaha', price: 242500 },
        { id: 'v210_c2', title: 'V210 = Casco + Montagem + F150 DETL 4T Yamaha', motor: 'F150 DETL 4T Yamaha', price: 265500 },
        { id: 'v210_c3', title: 'V210 = Casco + Montagem + 115 ELPT 4T Mercury', motor: '115 ELPT 4T Mercury', price: 268900 },
        { id: 'v210_c4', title: 'V210 = Casco + Montagem + 150 EFI 4T L Mercury', motor: '150 EFI 4T L Mercury', price: 293900 }
      ],
      acessorios: {
        opcionaisSugeridos: [
          { id: 'v210_acc_1', name: 'Sistema de Som (01 CD Player, 04 Alto-Falantes, 01 Antena, 01 Bolha)', price: 1800 },
          { id: 'v210_acc_2', name: 'Mastro de Ski', price: 3500 },
          { id: 'v210_acc_3', name: 'Buzina de Corneta Simples', price: 590 },
          { id: 'v210_acc_4', name: 'Buzina de Embutir', price: 450 },
          { id: 'v210_acc_5', name: 'Bússola', price: 290 },
          { id: 'v210_acc_6', name: 'Marcador de Combustível', price: 1650 },
          { id: 'v210_acc_7', name: 'Sistema de Direção Hidráulica - para versão Popa', price: 10900 },
          { id: 'v210_acc_8', name: 'Suporte de defensas (2 Pares) (V195, V205, V210, V215, V220)', price: 320 },
          { id: 'v210_acc_9', name: 'GPS 5', price: 5500 },
          { id: 'v210_acc_10', name: 'Defensas G3 (2 unidades) (V195, V205, V210, V215, V220)', price: 380 },
          { id: 'v210_acc_11', name: 'Radio VHF com antena e suporte', price: 3200 },
          { id: 'v210_acc_12', name: 'GPS 7', price: 7950 }
        ],
        kitsPremium: [
          { id: 'v210_acc_13', name: 'Kit EVA', price: 5900 },
          { id: 'v210_acc_14', name: 'Kit Salvatagem (09 Coletes Classe V, 01 Âncora DF 400, 50 Mts de Cabo, 01 Bandeira do Brasil, 01 Apito, 01 Extintor, 01 Sup. Boia)', price: 3100 },
          { id: 'v210_acc_15', name: 'Kit churrasqueira (churrasqueira, suporte e pedestal)', price: 4100 }
        ],
        opcionaisServico: [
          { id: 'v210_acc_16', name: 'Carreta Rodoviária de Metal V195 e V205', price: 17200 },
          { id: 'v210_acc_17', name: 'Carreta rodo encalhe de madeira', price: 11900 },
          { id: 'v210_acc_18', name: 'Lona de cobertura V210', price: 4200 },
          { id: 'v210_acc_19', name: 'Capota V210 V215', price: 3013.60 }
        ]
      }
    },

    'V215 Cabin Comfort': {
      model: 'V215 Cabin Comfort',
      linha: 'Linha Comfort',
      conjuntos: [
        { id: 'v215_c1', title: 'V215 = Casco + Montagem + F115 BETL 4T Yamaha', motor: 'F115 BETL 4T Yamaha', price: 253500 },
        { id: 'v215_c2', title: 'V215 = Casco + Montagem + F150 DETL 4T Yamaha', motor: 'F150 DETL 4T Yamaha', price: 276600 },
        { id: 'v215_c3', title: 'V215 = Casco + Montagem + 115 ELPT 4T Mercury', motor: '115 ELPT 4T Mercury', price: 287900 },
        { id: 'v215_c4', title: 'V215 = Casco + Montagem + 150 EFI 4T L Mercury', motor: '150 EFI 4T L Mercury', price: 312900 }
      ],
      acessorios: {
        opcionaisSugeridos: [
          { id: 'v215_acc_1', name: 'Sistema de Som (01 CD Player, 04 Alto-Falantes, 01 Antena, 01 Bolha)', price: 1800 },
          { id: 'v215_acc_2', name: 'Mastro de Ski', price: 3500 },
          { id: 'v215_acc_3', name: 'Buzina de Corneta Simples', price: 590 },
          { id: 'v215_acc_4', name: 'Buzina de Embutir', price: 450 },
          { id: 'v215_acc_5', name: 'Ventilador de Cabine (2)', price: 840 },
          { id: 'v215_acc_6', name: 'Bússola', price: 290 },
          { id: 'v215_acc_7', name: 'Marcador de Combustível', price: 1650 },
          { id: 'v215_acc_8', name: 'Sistema de Direção Hidráulica - para versão Popa', price: 10900 },
          { id: 'v215_acc_9', name: 'Suporte de defensas (2 Pares) (V195, V205, V210, V215, V220)', price: 320 },
          { id: 'v215_acc_10', name: 'GPS 5', price: 5500 },
          { id: 'v215_acc_11', name: 'Defensas G3 (2 unidades) (V195, V205, V210, V215, V220)', price: 380 },
          { id: 'v215_acc_12', name: 'Radio VHF com antena e suporte', price: 3200 },
          { id: 'v215_acc_13', name: 'GPS 7', price: 7950 }
        ],
        kitsPremium: [
          { id: 'v215_acc_14', name: 'Kit Eva', price: 4700 },
          { id: 'v215_acc_15', name: 'Kit TV (TV 12v com Entrada USB e Antena)', price: 4200 },
          { id: 'v215_acc_16', name: 'Kit Salvatagem (08 COLETES CLASSE V, 01 ANCORA DF 400, 50 MTS DE CABO, 01 BAND. BRASIL, 01 APITO, 01 EXTINTOR, 01 SUP. DE BOIA NÁUTICA)', price: 3070 },
          { id: 'v215_acc_17', name: 'Kit churrasqueira (churrasqueira, suporte e pedestal)', price: 4100 }
        ],
        opcionaisServico: [
          { id: 'v215_acc_18', name: 'Capota V210 V215', price: 3013.60 },
          { id: 'v215_acc_19', name: 'Carreta rodo encalhe de madeira v215', price: 12200 },
          { id: 'v215_acc_20', name: 'Lona de cobertura V215', price: 4350 }
        ]
      }
    }
  };

  // Registrar todos os modelos de todas as 3 linhas
  [...COMFORT_MODELS, ...PREMIUM_MODELS, ...PONTOON_MODELS].forEach(m => {
    if (m !== 'V195 Comfort - NEW' && m !== 'V205 CROSSOVER' && m !== 'V210 Comfort' && m !== 'V215 Cabin Comfort') {
      const linha = COMFORT_MODELS.includes(m) ? 'Linha Comfort' : (PREMIUM_MODELS.includes(m) ? 'Linha Premium' : 'Pontoon Series');
      VENTURA_MODELS_DATA[m] = {
        model: m,
        linha: linha,
        conjuntos: [],
        acessorios: { opcionaisSugeridos: [], kitsPremium: [], opcionaisServico: [] }
      };
    }
  });

  let selectedLinhaKey = 'comfort'; // 'comfort', 'premium', 'pontoon'
  let selectedBoatModel = 'V195 Comfort - NEW';
  let selectedConjuntoId = 'c1';
  let selectedAccessoryIds = new Set();

  function formatMoneyBRL(val) {
    return 'R$ ' + Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function selectLinhaCategory(linhaKey) {
    selectedLinhaKey = linhaKey;
    let firstModel = 'V195 Comfort - NEW';
    if (linhaKey === 'comfort') firstModel = COMFORT_MODELS[0];
    else if (linhaKey === 'premium') firstModel = PREMIUM_MODELS[0];
    else if (linhaKey === 'pontoon') firstModel = PONTOON_MODELS[0];

    selectedBoatModel = firstModel;
    const data = VENTURA_MODELS_DATA[firstModel];
    selectedConjuntoId = (data && data.conjuntos && data.conjuntos.length > 0) ? data.conjuntos[0].id : null;
    selectedAccessoryIds.clear();

    updateLinhaTabsUI();
    renderModelPillsGrid();
    initBoatConfigurator();
  }

  function updateLinhaTabsUI() {
    const tC = document.getElementById('tabComfort');
    const tP = document.getElementById('tabPremium');
    const tPo = document.getElementById('tabPontoon');

    const activeStyle = "padding: 8px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-nautico); background: rgba(37,99,235,0.22); color: #FFF; font-weight: 700; cursor: pointer; transition: all 0.2s;";
    const inactiveStyle = "padding: 8px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-bg-card); color: var(--color-text-muted); font-weight: 600; cursor: pointer; transition: all 0.2s;";

    if (tC) tC.style.cssText = selectedLinhaKey === 'comfort' ? activeStyle : inactiveStyle;
    if (tP) tP.style.cssText = selectedLinhaKey === 'premium' ? activeStyle : inactiveStyle;
    if (tPo) tPo.style.cssText = selectedLinhaKey === 'pontoon' ? activeStyle : inactiveStyle;
  }

  function renderModelPillsGrid() {
    const grid = document.getElementById('modelPillsGrid');
    if (!grid) return;

    let models = COMFORT_MODELS;
    if (selectedLinhaKey === 'premium') models = PREMIUM_MODELS;
    else if (selectedLinhaKey === 'pontoon') models = PONTOON_MODELS;

    let html = '';
    models.forEach(m => {
      const activeClass = m === selectedBoatModel ? 'active' : '';
      const data = VENTURA_MODELS_DATA[m];
      const isConfigured = data && data.conjuntos && data.conjuntos.length > 0;
      const star = isConfigured ? ' ⭐' : '';
      html += `
        <button type="button" class="model-pill ${activeClass}" data-model="${m}" onclick="selectBoatModel('${m}')">${m}${star}</button>
      `;
    });
    grid.innerHTML = html;
  }

  function initBoatConfigurator() {
    try {
      updateLinhaTabsUI();
      renderModelPillsGrid();
      renderConjuntosGrid();
      renderAccessoriesGrid();
      updateConfiguratorUI();
    } catch (e) {
      console.error('Erro ao inicializar configurador:', e);
    }
  }

  function selectBoatModel(model) {
    if (!VENTURA_MODELS_DATA[model]) return;
    selectedBoatModel = model;
    const data = VENTURA_MODELS_DATA[model];
    selectedConjuntoId = (data && data.conjuntos && data.conjuntos.length > 0) ? data.conjuntos[0].id : null;
    selectedAccessoryIds.clear();
    initBoatConfigurator();
  }

  function selectBoatConjunto(conjuntoId) {
    selectedConjuntoId = conjuntoId;
    renderConjuntosGrid();
    updateConfiguratorUI();
  }

  function toggleAccessory(accId) {
    if (selectedAccessoryIds.has(accId)) {
      selectedAccessoryIds.delete(accId);
    } else {
      selectedAccessoryIds.add(accId);
    }
    renderAccessoriesGrid();
    updateConfiguratorUI();
  }

  function renderConjuntosGrid() {
    const grid = document.getElementById('conjuntosGrid');
    if (!grid) return;

    const data = VENTURA_MODELS_DATA[selectedBoatModel];
    if (!data) return;

    if (!data.conjuntos || data.conjuntos.length === 0) {
      grid.innerHTML = `
        <div style="padding: 12px 16px; font-size: 0.88rem; color: var(--color-accent-light); background: rgba(212, 168, 83, 0.08); border-radius: var(--radius-sm); border: 1px dashed rgba(212, 168, 83, 0.3);">
          ℹ️ Modelo <strong>${selectedBoatModel}</strong> selecionado! O nome da embarcação já foi preenchido automaticamente. Os conjuntos e acessórios específicos deste barco serão liberados nas próximas etapas.
        </div>
      `;
      return;
    }

    let html = '';
    data.conjuntos.forEach(c => {
      const activeClass = c.id === selectedConjuntoId ? 'active' : '';
      html += `
        <div class="conjunto-card ${activeClass}" onclick="selectBoatConjunto('${c.id}')">
          <div class="conjunto-card__info">
            <div class="conjunto-card__radio"></div>
            <span class="conjunto-card__title">${c.title}</span>
          </div>
          <span class="conjunto-card__price">${formatMoneyBRL(c.price)}</span>
        </div>
      `;
    });
    grid.innerHTML = html;
  }

  function renderAccessoriesGrid() {
    const data = VENTURA_MODELS_DATA[selectedBoatModel];
    if (!data) return;

    renderCategoryGroup('gridOpcionaisSugeridos', data.acessorios.opcionaisSugeridos);
    renderCategoryGroup('gridKitsPremium', data.acessorios.kitsPremium);
    renderCategoryGroup('gridOpcionaisServico', data.acessorios.opcionaisServico);
  }

  function renderCategoryGroup(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (!items || items.length === 0) {
      grid.innerHTML = `<span style="font-size: 0.82rem; color: var(--color-text-muted);">Disponível em breve</span>`;
      return;
    }

    let html = '';
    items.forEach(acc => {
      const isSelected = selectedAccessoryIds.has(acc.id);
      const selClass = isSelected ? 'selected' : '';
      const checkedAttr = isSelected ? 'checked' : '';
      html += `
        <div class="accessory-item ${selClass}" onclick="toggleAccessory('${acc.id}')">
          <div class="accessory-item__left">
            <input type="checkbox" class="accessory-item__checkbox" ${checkedAttr} onclick="event.stopPropagation(); toggleAccessory('${acc.id}');">
            <span class="accessory-item__name">${acc.name}</span>
          </div>
          <span class="accessory-item__price">${formatMoneyBRL(acc.price)}</span>
        </div>
      `;
    });
    grid.innerHTML = html;
  }

  function updateConfiguratorUI() {
    const data = VENTURA_MODELS_DATA[selectedBoatModel];
    if (!data) return;

    // Atualizar pills ativas no DOM
    document.querySelectorAll('.model-pill').forEach(btn => {
      if (btn.getAttribute('data-model') === selectedBoatModel) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const conjunto = data.conjuntos.find(c => c.id === selectedConjuntoId) || data.conjuntos[0];
    let total = conjunto ? conjunto.price : 0;

    let allAccessories = [
      ...(data.acessorios.opcionaisSugeridos || []),
      ...(data.acessorios.kitsPremium || []),
      ...(data.acessorios.opcionaisServico || [])
    ];

    let chosenAccessories = [];
    allAccessories.forEach(acc => {
      if (selectedAccessoryIds.has(acc.id)) {
        total += acc.price;
        chosenAccessories.push(acc.name);
      }
    });

    // Atualizar barra de resumo
    const summaryConjunto = document.getElementById('summaryConjuntoName');
    const summaryCount = document.getElementById('summaryAcessoriosCount');
    const summaryTotal = document.getElementById('summaryTotalValue');

    if (summaryConjunto) summaryConjunto.textContent = conjunto ? conjunto.title : selectedBoatModel;
    if (summaryCount) summaryCount.textContent = `${chosenAccessories.length} Acessórios Selecionados`;
    if (summaryTotal) summaryTotal.textContent = total > 0 ? formatMoneyBRL(total) : 'Preenchimento Manual';

    // Preencher campos do formulário náutico automaticamente
    setVal('naut-modelo', selectedBoatModel);
    if (conjunto) setVal('naut-motorizacao', conjunto.motor);
    if (total > 0) setVal('naut-valor-total', formatMoneyBRL(total));
    if (chosenAccessories.length > 0) setVal('naut-acessorios', chosenAccessories.join(', '));
  }

  // ---- Public VenturaApp API ----
  window.showTab = selectCategory;
  window.selectCategory = selectCategory;
  window.selectLinhaCategory = selectLinhaCategory;
  window.selectBoatModel = selectBoatModel;
  window.selectBoatConjunto = selectBoatConjunto;
  window.toggleAccessory = toggleAccessory;
  window.quickFill = quickFillSampleData;
  window.quickFillSampleData = quickFillSampleData;
  window.clearForm = clearForm;
  window.clearFormApp = clearForm;
  window.showPreview = showPreview;
  window.showPreviewApp = showPreview;
  window.hidePreview = hidePreview;
  window.generatePDF = generatePDF;
  window.generatePDFApp = generatePDF;
  window.generateBoletoSchedule = generateBoletoSchedule;

  window.VenturaApp = {
    selectCategory: selectCategory,
    selectBoatModel: selectBoatModel,
    selectBoatConjunto: selectBoatConjunto,
    toggleAccessory: toggleAccessory,
    quickFill: quickFillSampleData,
    clear: clearForm,
    preview: showPreview,
    closePreview: hidePreview,
    generate: generatePDF,
    generateBoletoSchedule: generateBoletoSchedule
  };

  // ---- Iniciar quando DOM estiver pronto ----
  document.addEventListener('DOMContentLoaded', init);

  // Bind direct click handlers for fail-safe fallback
  window.addEventListener('load', function() {
    init();
  });
})();
