// tablero.js

document.addEventListener('DOMContentLoaded', () => {

  const container  = document.getElementById('cardsContainer');
  const heroTotal  = document.getElementById('heroTotal');

  // ── Modal Nueva Meta ──
  const overlay       = document.getElementById('modalOverlay');
  const openModalBtn  = document.getElementById('openModalBtn');
  const fabBtn        = document.getElementById('fabBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelBtn     = document.getElementById('cancelModalBtn');
  const saveBtn       = document.getElementById('saveModalBtn');

  // ── Modal Añadir Dinero ──
  const addMoneyOverlay    = document.getElementById('addMoneyOverlay');
  const closeAddMoneyBtn   = document.getElementById('closeAddMoneyBtn');
  const cancelAddMoneyBtn  = document.getElementById('cancelAddMoneyBtn');
  const confirmAddMoneyBtn = document.getElementById('confirmAddMoneyBtn');
  const addMoneyGoalName   = document.getElementById('addMoneyGoalName');
  const addMoneyAmountInput= document.getElementById('addMoneyAmount');
  let   addMoneyTargetId   = null;

  // ── Modal Eliminar / Romper ──
  const deleteOverlay    = document.getElementById('deleteOverlay');
  const closeDeleteBtn   = document.getElementById('closeDeleteBtn');
  const cancelDeleteBtn  = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteGoalName   = document.getElementById('deleteGoalName');
  let   deleteTargetId   = null;
  let   deleteMode       = 'delete'; // 'delete' | 'break'


  // ══════════════════════════════════════
  //  NOTIFICACIÓN BONITA (parte superior)
  // ══════════════════════════════════════

  function showNotification(msg, type = 'warning') {
    // Eliminar si ya existe
    const existing = document.getElementById('app-notification');
    if (existing) existing.remove();

    const colors = {
      warning: { bg: '#4B1535', text: '#F3C8DD', icon: 'iconoir-warning-triangle' },
      success: { bg: '#3A345B', text: '#F3C8DD', icon: 'iconoir-check-circle'     },
      error:   { bg: '#c0392b', text: '#ffffff',  icon: 'iconoir-xmark-circle'     },
    };
    const c = colors[type] || colors.warning;

    const notif = document.createElement('div');
    notif.id = 'app-notification';
    notif.innerHTML = `<i class="${c.icon}"></i><span>${msg}</span>`;
    notif.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%) translateY(-80px);
      background: ${c.bg};
      color: ${c.text};
      font-family: 'Nunito', sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 12px 20px;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      display: flex;
      align-items: flex-start;
      gap: 10px;
      max-width: 88vw;
      width: max-content;
      z-index: 9999;
      line-height: 1.5;
      transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.35s ease;
      opacity: 0;
    `;

    document.body.appendChild(notif);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notif.style.transform = 'translateX(-50%) translateY(0)';
        notif.style.opacity   = '1';
      });
    });

    setTimeout(() => {
      notif.style.transform = 'translateX(-50%) translateY(-80px)';
      notif.style.opacity   = '0';
      setTimeout(() => notif.remove(), 400);
    }, 4000);
  }


  // ══════════════════════════════════════
  //  LOCALSTORAGE
  // ══════════════════════════════════════

  function getGoals()    { return JSON.parse(localStorage.getItem('monedita_goals')  || '[]'); }
  function getBroken()   { return JSON.parse(localStorage.getItem('monedita_broken') || '[]'); }
  function saveGoals(g)  { localStorage.setItem('monedita_goals',  JSON.stringify(g)); }
  function saveBroken(g) { localStorage.setItem('monedita_broken', JSON.stringify(g)); }


  // ══════════════════════════════════════
  //  HERO TOTAL
  // ══════════════════════════════════════

  function updateHeroTotal(goals) {
    const total = goals.reduce((sum, g) => sum + (parseFloat(g.saved) || 0), 0);
    heroTotal.textContent = `Bs.- ${total.toLocaleString('es-BO')}`;
  }


  // ══════════════════════════════════════
  //  RENDER CARDS
  // ══════════════════════════════════════

  function loadGoals() {
    const goals = getGoals();
    container.innerHTML = '';
    goals.forEach(goal => renderCard(goal));
    updateHeroTotal(goals);
  }

  function renderCard(goal) {
    const saved   = parseFloat(goal.saved)  || 0;
    const amount  = parseFloat(goal.amount) || 0;
    const percent = amount > 0 ? Math.min(Math.round((saved / amount) * 100), 100) : 0;
    const left    = 100 - percent;
    const done    = percent >= 100;

    const cardClass = done ? 'card-mint'  : 'card-pink';
    const fillClass = done ? 'fill-green' : 'fill-pink';
    const leftLabel = done ? '(Completado)' : `(Falta ${left}%)`;

    const card = document.createElement('div');
    card.className = `goal-card ${cardClass}`;
    card.dataset.id = goal.id;

    card.innerHTML = `
      <div class="card-top">
        <img src="../img/cerdo.png" alt="Piggy" class="piggy-img" />
        <div class="card-info">
          <div class="card-title-row">
            <span class="card-name">${goal.name}</span>
            <i class="iconoir-trash card-delete" data-id="${goal.id}" title="Eliminar"></i>
          </div>
          <p class="card-amount">
            Bs.- ${saved.toLocaleString('es-BO')} / <span>Bs.- ${amount.toLocaleString('es-BO')}</span>
            <span class="card-left">${leftLabel}</span>
          </p>
          <div class="progress-bar">
            <div class="progress-fill ${fillClass}" style="width:${percent}%"></div>
          </div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-white btn-add-money" data-id="${goal.id}">Añadir Dinero</button>
        <button class="${done ? 'btn-white' : 'btn-ghost'} btn-break" data-id="${goal.id}">Romper la alcancía</button>
      </div>
    `;

    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    container.appendChild(card);
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    // ── Basurero → eliminar ──
    card.querySelector('.card-delete').addEventListener('click', () => {
      deleteTargetId = goal.id;
      deleteMode     = 'delete';
      deleteGoalName.textContent = `"${goal.name}"`;
      confirmDeleteBtn.innerHTML = '<i class="iconoir-trash"></i> Sí, eliminar';
      deleteOverlay.classList.add('open');
    });

    // ── Añadir Dinero ──
    card.querySelector('.btn-add-money').addEventListener('click', () => {
      addMoneyTargetId = goal.id;
      addMoneyGoalName.textContent = goal.name;
      addMoneyAmountInput.value = '';
      addMoneyOverlay.classList.add('open');
    });

    // ── Romper la alcancía ──
    card.querySelector('.btn-break').addEventListener('click', () => {
      deleteTargetId = goal.id;
      deleteMode     = 'break';
      deleteGoalName.textContent = `"${goal.name}"`;
      confirmDeleteBtn.innerHTML = '<i class="iconoir-db-warning"></i> Sí, romper';
      deleteOverlay.classList.add('open');
    });
  }


  // ══════════════════════════════════════
  //  MODAL — NUEVA META
  // ══════════════════════════════════════

  function openModal()  { overlay.classList.add('open'); }
  function closeModal() { overlay.classList.remove('open'); }

  openModalBtn.addEventListener('click', openModal);
  fabBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  saveBtn.addEventListener('click', () => {
    const name   = document.getElementById('goalName').value.trim();
    const amount = parseFloat(document.getElementById('goalAmount').value);
    const saved  = parseFloat(document.getElementById('goalSaved').value) || 0;

    if (!name) { shakeInput('goalName'); return; }
    if (!amount || isNaN(amount)) { shakeInput('goalAmount'); return; }

    // Validación: dinero inicial no puede superar el objetivo
    if (saved > amount) {
      const exceso = (saved - amount).toLocaleString('es-BO');
      const falta  = amount.toLocaleString('es-BO');
      showNotification(
        `El dinero inicial (Bs.- ${saved.toLocaleString('es-BO')}) supera tu meta de Bs.- ${falta}.\nSolo puedes ingresar hasta Bs.- ${falta}. El excedente de Bs.- ${exceso} puedes guardarlo en tu Billetera Móvil.`,
        'warning'
      );
      shakeInput('goalSaved');
      return;
    }

    saveBtn.innerHTML = '<i class="iconoir-check-circle"></i> ¡Guardado!';
    saveBtn.style.background = '#6abf96';

    setTimeout(() => {
      saveBtn.innerHTML = '<i class="iconoir-check"></i> Guardar';
      saveBtn.style.background = '';

      const newGoal = {
        id:     Date.now().toString(),
        name,
        amount,
        saved,
        date: document.getElementById('goalDate').value || ''
      };

      const goals = getGoals();
      goals.push(newGoal);
      saveGoals(goals);
      loadGoals();
      closeModal();
      clearForm();
    }, 1000);
  });


  // ══════════════════════════════════════
  //  MODAL — AÑADIR DINERO
  // ══════════════════════════════════════

  function closeAddMoney() {
    addMoneyOverlay.classList.remove('open');
    addMoneyTargetId = null;
    addMoneyAmountInput.value = '';
  }

  closeAddMoneyBtn.addEventListener('click', closeAddMoney);
  cancelAddMoneyBtn.addEventListener('click', closeAddMoney);
  addMoneyOverlay.addEventListener('click', e => { if (e.target === addMoneyOverlay) closeAddMoney(); });

  confirmAddMoneyBtn.addEventListener('click', () => {
    const extra = parseFloat(addMoneyAmountInput.value);
    if (isNaN(extra) || extra <= 0) { shakeInput('addMoneyAmount'); return; }

    const goals = getGoals();
    const g = goals.find(x => x.id === addMoneyTargetId);
    if (g) {
      const antes   = parseFloat(g.saved) || 0;
      const maximo  = parseFloat(g.amount);
      const nuevo   = antes + extra;

      if (nuevo > maximo) {
        const exceso = (nuevo - maximo).toLocaleString('es-BO');
        showNotification(
          `Con Bs.- ${extra.toLocaleString('es-BO')} superarías tu meta. Solo faltan Bs.- ${(maximo - antes).toLocaleString('es-BO')} para completarla. El excedente de Bs.- ${exceso} puedes guardarlo en tu Billetera Móvil.`,
          'warning'
        );
        shakeInput('addMoneyAmount');
        return;
      }

      g.saved = nuevo;
      saveGoals(goals);
      loadGoals();
    }
    closeAddMoney();
  });


  // ══════════════════════════════════════
  //  MODAL — ELIMINAR / ROMPER
  // ══════════════════════════════════════

  function closeDelete() {
    deleteOverlay.classList.remove('open');
    deleteTargetId = null;
  }

  closeDeleteBtn.addEventListener('click', closeDelete);
  cancelDeleteBtn.addEventListener('click', closeDelete);
  deleteOverlay.addEventListener('click', e => { if (e.target === deleteOverlay) closeDelete(); });

  confirmDeleteBtn.addEventListener('click', () => {
    if (!deleteTargetId) return;
    const goals = getGoals();
    const goal  = goals.find(g => g.id === deleteTargetId);

    if (deleteMode === 'break' && goal) {
      // Guardar en historial de rotas
      const broken = getBroken();
      broken.push({
        ...goal,
        brokenAt: new Date().toISOString()
      });
      saveBroken(broken);
    }

    // Eliminar de metas activas
    const updated = goals.filter(g => g.id !== deleteTargetId);
    saveGoals(updated);
    loadGoals();
    closeDelete();

    // Si rompió → ir a meta.html
    if (deleteMode === 'break') {
      setTimeout(() => {
        location.href = 'meta.html';
      }, 300);
    }
  });


  // ══════════════════════════════════════
  //  NAV
  // ══════════════════════════════════════

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Nav → Metas
  document.querySelector('.nav-item:nth-child(2)').addEventListener('click', () => {
    location.href = 'meta.html';
  });


  // ══════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════

  function shakeInput(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#e05c3a';
    setTimeout(() => { el.style.borderColor = ''; }, 800);
  }

  function clearForm() {
    ['goalName','goalAmount','goalSaved','goalDate'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  loadGoals();
});