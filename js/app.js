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
        generateBoletoSchedule('nautico');
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
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
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

  // ---- Public VenturaApp API ----
  window.showTab = selectCategory;
  window.selectCategory = selectCategory;
  window.quickFill = quickFillSampleData;
  window.quickFillSampleData = quickFillSampleData;
  window.clearForm = clearForm;
  window.showPreview = showPreview;
  window.hidePreview = hidePreview;
  window.generatePDF = generatePDF;
  window.generateBoletoSchedule = generateBoletoSchedule;

  window.VenturaApp = {
    selectCategory: selectCategory,
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
