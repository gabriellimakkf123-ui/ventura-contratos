/**
 * Ventura Marine — Edição Boat Show
 * Módulo de Assinatura Digital Touchscreen do Cliente (js/signature.js)
 */

(function() {
  'use strict';

  let canvas = null;
  let ctx = null;
  let isDrawing = false;
  let hasSigned = false;
  let activeContractId = null;

  function initCanvas() {
    canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    // Eventos Touch e Mouse unificados via PointerEvents
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    
    // Suporte a telas Retina/High-DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.strokeStyle = '#0f2942'; // Azul marinho nobre para a tinta da assinatura
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function handlePointerDown(e) {
    e.preventDefault();
    isDrawing = true;
    hasSigned = true;
    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  }

  function handlePointerMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }

  function handlePointerUp(e) {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
    }
  }

  function clearCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    hasSigned = false;
  }

  function openSignatureModal(contractId) {
    activeContractId = contractId;
    const modal = document.getElementById('signatureModal');
    const contract = window.VenturaDB ? window.VenturaDB.getContractById(contractId) : null;
    
    if (!modal || !contract) {
      alert('Contrato não encontrado para assinatura.');
      return;
    }

    const titleEl = document.getElementById('sigModalContractTitle');
    const clientEl = document.getElementById('sigModalClientName');
    const valEl = document.getElementById('sigModalTotalValue');

    if (titleEl) titleEl.textContent = `Contrato Oficial: ${contract.id} — ${contract.dados.modelo}`;
    if (clientEl) clientEl.textContent = `Cliente: ${contract.dados.compradorNome || 'Não informado'}`;
    if (valEl) valEl.textContent = `Valor: ${contract.dados.valorTotal || 'R$ 0,00'}`;

    modal.classList.add('visible');
    modal.style.display = 'flex';

    setTimeout(() => {
      initCanvas();
      clearCanvas();
    }, 100);
  }

  function closeSignatureModal() {
    const modal = document.getElementById('signatureModal');
    if (modal) {
      modal.classList.remove('visible');
      modal.style.display = 'none';
    }
    activeContractId = null;
    clearCanvas();
  }

  function confirmSignature() {
    if (!hasSigned) {
      alert('Por favor, solicite ao cliente que desenhe a assinatura no campo indicado.');
      return;
    }

    if (!activeContractId) return;

    // Gerar imagem em base64 da assinatura
    const signatureDataUrl = canvas.toDataURL('image/png');

    const res = window.VenturaDB.attachSignature(activeContractId, signatureDataUrl);
    if (res.success) {
      if (window.showToast) {
        window.showToast('Contrato assinado com sucesso pelo cliente! Gerando documento final...');
      }

      const contract = window.VenturaDB.getContractById(activeContractId);
      closeSignatureModal();

      // Gerar e baixar automaticamente o PDF assinado
      if (window.generatePDFFromContract) {
        window.generatePDFFromContract(contract);
      }
    } else {
      alert(res.message);
    }
  }

  function setPhysicalSignature() {
    if (!activeContractId) return;
    const res = window.VenturaDB.attachSignature(activeContractId, 'ASSINATURA_FISICA');
    if (res.success) {
      if (window.showToast) {
        window.showToast('Contrato pronto para assinatura física no estande!');
      }
      const contract = window.VenturaDB.getContractById(activeContractId);
      closeSignatureModal();
      if (window.generatePDFFromContract) {
        window.generatePDFFromContract(contract);
      }
    }
  }

  window.VenturaSignature = {
    initCanvas: initCanvas,
    clearCanvas: clearCanvas,
    openSignatureModal: openSignatureModal,
    closeSignatureModal: closeSignatureModal,
    confirmSignature: confirmSignature,
    setPhysicalSignature: setPhysicalSignature
  };

  document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
  });

})();
