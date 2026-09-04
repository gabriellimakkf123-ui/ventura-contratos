/**
 * Ventura Marine — Edição Boat Show 2026
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
      username: 'carlos',
      name: 'Carlos Renato',
      role: 'approver',
      roleLabel: 'Diretoria / Aprovador',
      pin: '1234',
      email: 'carlos@ventura.com.br',
      phone: '(11) 99876-0001',
      avatar: 'CR'
    },
    {
      id: 'andre',
      username: 'andre',
      name: 'André',
      role: 'approver',
      roleLabel: 'Diretoria / Aprovador',
      pin: '1234',
      email: 'andre@ventura.com.br',
      phone: '(11) 99876-0002',
      avatar: 'AN'
    },
    {
      id: 'marcos',
      username: 'marcos',
      name: 'Marcos',
      role: 'approver',
      roleLabel: 'Diretoria / Aprovador',
      pin: '1234',
      email: 'marcos@ventura.com.br',
      phone: '(11) 99876-0003',
      avatar: 'MA'
    },

    // --- CONSULTORES DE VENDA (ESTANDE) ---
    {
      id: 'consultor_01',
      username: 'vendas1',
      name: 'Consultor de Vendas 01',
      role: 'seller',
      roleLabel: 'Consultor de Vendas — Estande',
      pin: '1234',
      email: 'consultor1@ventura.com.br',
      phone: '(11) 97111-0001',
      avatar: 'V1'
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

  function login(identifier, pin) {
    if (!identifier || !identifier.trim()) {
      return { success: false, message: 'Por favor, informe seu e-mail ou usuário.' };
    }
    if (!pin || !pin.trim()) {
      return { success: false, message: 'Por favor, digite sua senha.' };
    }

    const cleanId = identifier.trim().toLowerCase();
    const cleanPin = pin.trim();
    const users = getAllUsers();

    // Busca flexível por e-mail, username ou ID
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.id && u.id.toLowerCase() === cleanId) ||
      (u.name && u.name.toLowerCase() === cleanId)
    );

    if (!user) {
      return { success: false, message: 'Usuário ou e-mail não encontrado no sistema.' };
    }

    if (user.pin && user.pin !== cleanPin) {
      return { success: false, message: 'Senha incorreta. Tente novamente.' };
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

  function registerNewSeller(name, email, phone, pin) {
    if (!name || name.trim() === '') {
      return { success: false, message: 'O nome completo é obrigatório.' };
    }
    if (!email || email.trim() === '') {
      return { success: false, message: 'O e-mail é obrigatório para login.' };
    }
    if (!pin || pin.trim() === '') {
      return { success: false, message: 'Defina uma senha para o seu acesso.' };
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    // Validar se e-mail já existe
    const users = getAllUsers();
    const existing = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.' };
    }

    const id = 'consultor_' + Date.now().toString(36);
    const initials = cleanName.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'V';
    
    const newUser = {
      id: id,
      username: cleanEmail.split('@')[0],
      name: cleanName,
      role: 'seller',
      roleLabel: 'Consultor de Vendas — Estande',
      pin: cleanPin,
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      avatar: initials
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_USERS);
      let custom = stored ? JSON.parse(stored) : [];
      custom.push(newUser);
      localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(custom));
      
      // Auto-login do novo consultor
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      window.dispatchEvent(new CustomEvent('ventura:auth_change', { detail: { user: newUser } }));

      return { success: true, user: newUser };
    } catch (e) {
      return { success: false, message: 'Erro ao cadastrar novo consultor.' };
    }
  }

  function updateUserPassword(userId, newPin) {
    if (!newPin || !newPin.trim()) {
      return { success: false, message: 'A nova senha não pode ser vazia.' };
    }
    try {
      const users = getAllUsers();
      const user = users.find(u => u.id === userId);
      if (!user) return { success: false, message: 'Usuário não encontrado.' };

      user.pin = newPin.trim();

      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_USERS);
      let custom = stored ? JSON.parse(stored) : [];
      const idx = custom.findIndex(u => u.id === userId);
      if (idx !== -1) {
        custom[idx] = user;
      } else {
        custom.push(user);
      }
      localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(custom));

      // Atualizar currentUser se for o mesmo
      const current = getCurrentUser();
      if (current && current.id === userId) {
        current.pin = newPin.trim();
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(current));
      }

      return { success: true, message: 'Senha atualizada com sucesso!' };
    } catch (e) {
      return { success: false, message: 'Erro ao salvar nova senha.' };
    }
  }

  window.VenturaAuth = {
    getAllUsers: getAllUsers,
    getCurrentUser: getCurrentUser,
    login: login,
    logout: logout,
    isApprover: isApprover,
    isSeller: isSeller,
    registerNewSeller: registerNewSeller,
    updateUserPassword: updateUserPassword
  };

})();
