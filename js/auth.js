/**
 * Ventura Marine — Edição Boat Show
 * Módulo de Autenticação e Perfis (js/auth.js)
 */

(function() {
  'use strict';

  const STORAGE_KEY_USER = 'ventura_boatshow_current_user';
  const STORAGE_KEY_CUSTOM_USERS = 'ventura_boatshow_custom_users';

  // Usuários Oficiais Padrão
  const DEFAULT_USERS = [
    // --- DIRETORIA / APROVADORES ---
    {
      id: 'carlos_renato',
      name: 'Carlos Renato',
      role: 'approver',
      roleLabel: 'Diretoria / Aprovador',
      pin: '1234',
      email: 'carlos.renato@venturamarine.com.br',
      phone: '(11) 99876-0001',
      avatar: 'CR'
    },
    {
      id: 'andre',
      name: 'André',
      role: 'approver',
      roleLabel: 'Diretoria / Aprovador',
      pin: '1234',
      email: 'andre@venturamarine.com.br',
      phone: '(11) 99876-0002',
      avatar: 'AN'
    },
    {
      id: 'marcos',
      name: 'Marcos',
      role: 'approver',
      roleLabel: 'Diretoria / Aprovador',
      pin: '1234',
      email: 'marcos@venturamarine.com.br',
      phone: '(11) 99876-0003',
      avatar: 'MA'
    },

    // --- CONSULTORES DE VENDA (ESTANDE) ---
    {
      id: 'consultor_01',
      name: 'Consultor de Vendas 01',
      role: 'seller',
      roleLabel: 'Consultor de Vendas — Estande A',
      pin: '1234',
      email: 'vendas01@venturamarine.com.br',
      phone: '(11) 97111-0001',
      avatar: 'V1'
    },
    {
      id: 'consultor_02',
      name: 'Consultor de Vendas 02',
      role: 'seller',
      roleLabel: 'Consultor de Vendas — Estande B',
      pin: '1234',
      email: 'vendas02@venturamarine.com.br',
      phone: '(11) 97111-0002',
      avatar: 'V2'
    },
    {
      id: 'consultor_03',
      name: 'Consultor de Vendas 03',
      role: 'seller',
      roleLabel: 'Consultor de Vendas — Estande C',
      pin: '1234',
      email: 'vendas03@venturamarine.com.br',
      phone: '(11) 97111-0003',
      avatar: 'V3'
    }
  ];

  function getAllUsers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_USERS);
      if (stored) {
        const custom = JSON.parse(stored);
        const userMap = new Map();
        DEFAULT_USERS.forEach(u => userMap.set(u.id, u));
        custom.forEach(u => userMap.set(u.id, u));
        return Array.from(userMap.values());
      }
    } catch (e) {
      console.warn('Erro ao carregar usuários customizados:', e);
    }
    return DEFAULT_USERS;
  }

  function getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao recuperar usuário logado:', e);
    }
    return null;
  }

  function login(userId, pin) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    if (user.pin && user.pin !== pin) {
      return { success: false, message: 'Senha / PIN incorreto.' };
    }

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('ventura:auth_change', { detail: { user: user } }));
      return { success: true, user: user };
    } catch (e) {
      return { success: false, message: 'Falha ao salvar sessão local.' };
    }
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      window.dispatchEvent(new CustomEvent('ventura:auth_change', { detail: { user: null } }));
    } catch (e) {
      console.error('Erro no logout:', e);
    }
  }

  function isApprover() {
    const user = getCurrentUser();
    return user && user.role === 'approver';
  }

  function isSeller() {
    const user = getCurrentUser();
    return user && user.role === 'seller';
  }

  function registerNewSeller(name, phone, email, pin) {
    if (!name || name.trim() === '') {
      return { success: false, message: 'Nome é obrigatório.' };
    }
    const cleanName = name.trim();
    const id = 'consultor_' + Date.now().toString(36);
    const initials = cleanName.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'V';
    const newUser = {
      id: id,
      name: cleanName,
      role: 'seller',
      roleLabel: 'Consultor de Vendas — Estande',
      pin: pin || '1234',
      email: email || `${id}@venturamarine.com.br`,
      phone: phone || '',
      avatar: initials
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_USERS);
      let custom = stored ? JSON.parse(stored) : [];
      custom.push(newUser);
      localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(custom));
      return { success: true, user: newUser };
    } catch (e) {
      return { success: false, message: 'Erro ao cadastrar novo consultor.' };
    }
  }

  window.VenturaAuth = {
    getAllUsers: getAllUsers,
    getCurrentUser: getCurrentUser,
    login: login,
    logout: logout,
    isApprover: isApprover,
    isSeller: isSeller,
    registerNewSeller: registerNewSeller
  };

})();
