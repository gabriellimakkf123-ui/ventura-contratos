/**
 * Ventura Marine — Edição Boat Show
 * Banco de Dados Local & Fila de Aprovação (js/contracts-db.js)
 */

(function() {
  'use strict';

  const STORAGE_KEY_CONTRACTS = 'ventura_boatshow_contracts_db';

  function _loadAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONTRACTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler banco de contratos:', e);
      return [];
    }
  }

  function _saveAll(list) {
    try {
      localStorage.setItem(STORAGE_KEY_CONTRACTS, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('ventura:contracts_change'));
    } catch (e) {
      console.error('Erro ao salvar contratos:', e);
    }
  }

  // Sincronização em tempo real entre abas do navegador
  window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY_CONTRACTS) {
      window.dispatchEvent(new CustomEvent('ventura:contracts_change'));
    }
  });

  function createProposal(formData, options) {
    options = options || {};
    const user = window.VenturaAuth ? window.VenturaAuth.getCurrentUser() : null;
    if (!user) {
      return { success: false, message: 'Usuário não autenticado.' };
    }

    const list = _loadAll();
    const id = 'BS-' + new Date().getFullYear() + '-' + (list.length + 1).toString().padStart(4, '0');
    
    // Se explicitamente solicitado aprovação direta pela diretoria
    const isDirectApproved = options.directApprove === true && user.role === 'approver';

    const newContract = {
      id: id,
      criadoEm: new Date().toISOString(),
      vendedorId: user.id,
      vendedorNome: user.name,
      vendedorRole: user.roleLabel,
      vendedorEmail: user.email || '',
      vendedorTel: user.phone || '',
      evento: formData.evento || 'Boat Show 2026',
      
      // Status: 'pendente' | 'aprovado' | 'rejeitado' | 'assinado'
      status: isDirectApproved ? 'aprovado' : 'pendente',
      aprovadoPor: isDirectApproved ? user.name : null,
      aprovadoEm: isDirectApproved ? new Date().toISOString() : null,
      aprovacaoNotas: isDirectApproved ? 'Criado diretamente pela Diretoria' : '',
      
      motivoRejeicao: null,
      rejeitadoPor: null,
      
      assinaturaCliente: null,
      assinadoEm: null,
      
      // Dados da Embarcação & Comerciais
      dados: {
        ...formData
      }
    };

    list.unshift(newContract);
    _saveAll(list);

    return {
      success: true,
      contract: newContract,
      message: isDirectApproved 
        ? 'Contrato criado e aprovado pela Diretoria!' 
        : `Proposta ${id} enviada com sucesso para aprovação da Diretoria (Carlos Renato, André e Marcos)!`
    };
  }

  function getContractsForCurrentUser() {
    const user = window.VenturaAuth ? window.VenturaAuth.getCurrentUser() : null;
    if (!user) return [];

    const all = _loadAll();

    // Se for Aprovador, vê todas as propostas da feira
    if (user.role === 'approver') {
      return all;
    }

    // Se for Vendedor, vê ESTRITAMENTE apenas as suas próprias propostas
    return all.filter(c => c.vendedorId === user.id);
  }

  function getPendingCount() {
    const user = window.VenturaAuth ? window.VenturaAuth.getCurrentUser() : null;
    if (!user) return 0;
    const all = _loadAll();
    if (user.role === 'approver') {
      return all.filter(c => c.status === 'pendente').length;
    }
    return all.filter(c => c.vendedorId === user.id && c.status === 'pendente').length;
  }

  function getApprovedReadyForSignCount() {
    const user = window.VenturaAuth ? window.VenturaAuth.getCurrentUser() : null;
    if (!user) return 0;
    const all = _loadAll();
    if (user.role === 'seller') {
      return all.filter(c => c.vendedorId === user.id && c.status === 'aprovado').length;
    }
    return all.filter(c => c.status === 'aprovado').length;
  }

  function getContractById(id) {
    const list = _loadAll();
    return list.find(c => c.id === id) || null;
  }

  function approveProposal(id, approverName, notes) {
    const user = window.VenturaAuth ? window.VenturaAuth.getCurrentUser() : null;
    if (!user || user.role !== 'approver') {
      return { success: false, message: 'Apenas a Diretoria pode aprovar contratos.' };
    }

    const list = _loadAll();
    const item = list.find(c => c.id === id);
    if (!item) return { success: false, message: 'Proposta não encontrada.' };

    item.status = 'aprovado';
    item.aprovadoPor = approverName || user.name;
    item.aprovadoEm = new Date().toISOString();
    item.aprovacaoNotas = notes || '';
    item.motivoRejeicao = null;

    _saveAll(list);
    return { success: true, contract: item, message: `Proposta ${id} aprovada com sucesso! Liberada para assinatura.` };
  }

  function rejectProposal(id, approverName, reason) {
    const user = window.VenturaAuth ? window.VenturaAuth.getCurrentUser() : null;
    if (!user || user.role !== 'approver') {
      return { success: false, message: 'Apenas a Diretoria pode solicitar ajustes.' };
    }

    const list = _loadAll();
    const item = list.find(c => c.id === id);
    if (!item) return { success: false, message: 'Proposta não encontrada.' };

    item.status = 'rejeitado';
    item.rejeitadoPor = approverName || user.name;
    item.motivoRejeicao = reason || 'Ajuste comercial solicitado pela Diretoria.';

    _saveAll(list);
    return { success: true, contract: item, message: `Proposta ${id} devolvida para ajuste do vendedor.` };
  }

  function attachSignature(id, signatureBase64) {
    const list = _loadAll();
    const item = list.find(c => c.id === id);
    if (!item) return { success: false, message: 'Proposta não encontrada.' };

    item.status = 'assinado';
    item.assinaturaCliente = signatureBase64;
    item.assinadoEm = new Date().toISOString();

    _saveAll(list);
    return { success: true, contract: item, message: `Contrato ${id} assinado com sucesso pelo cliente!` };
  }

  function deleteProposal(id) {
    const user = window.VenturaAuth ? window.VenturaAuth.getCurrentUser() : null;
    if (!user) return { success: false, message: 'Acesso negado.' };

    let list = _loadAll();
    const item = list.find(c => c.id === id);
    if (!item) return { success: false, message: 'Contrato não encontrado.' };

    // Vendedor só pode deletar contratos seus que ainda não estejam assinados
    if (user.role === 'seller' && item.vendedorId !== user.id) {
      return { success: false, message: 'Você não tem permissão para excluir este contrato.' };
    }

    list = list.filter(c => c.id !== id);
    _saveAll(list);
    return { success: true, message: `Contrato ${id} excluído.` };
  }

  window.VenturaDB = {
    createProposal: createProposal,
    getContractsForCurrentUser: getContractsForCurrentUser,
    getPendingCount: getPendingCount,
    getApprovedReadyForSignCount: getApprovedReadyForSignCount,
    getContractById: getContractById,
    approveProposal: approveProposal,
    rejectProposal: rejectProposal,
    attachSignature: attachSignature,
    deleteProposal: deleteProposal
  };

})();
