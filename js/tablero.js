// tablero.js

document.addEventListener('DOMContentLoaded', () => {

  const overlay       = document.getElementById('modalOverlay');
  const openModalBtn  = document.getElementById('openModalBtn');
  const fabBtn        = document.getElementById('fabBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelBtn     = document.getElementById('cancelModalBtn');
  const saveBtn       = document.getElementById('saveModalBtn');

  function openModal() {
    overlay.classList.add('open');
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  openModalBtn.addEventListener('click', openModal);
  fabBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  saveBtn.addEventListener('click', () => {
    const name   = document.getElementById('goalName').value.trim();
    const amount = document.getElementById('goalAmount').value.trim();

    if (!name || !amount) {
      if (!name)   shakeInput('goalName');
      if (!amount) shakeInput('goalAmount');
      return;
    }

    saveBtn.innerHTML = '<i class="iconoir-check-circle"></i> Saved!';
    saveBtn.style.background = '#6abf96';

    setTimeout(() => {
      saveBtn.innerHTML = '<i class="iconoir-check"></i> Save Goal';
      saveBtn.style.background = '';
      closeModal();
      clearForm();
    }, 1200);
  });

  function shakeInput(id) {
    const el = document.getElementById(id);
    el.style.borderColor = '#e05c3a';
    el.style.transition = 'border-color 0.2s';
    setTimeout(() => { el.style.borderColor = ''; }, 800);
  }

  function clearForm() {
    ['goalName','goalAmount','goalSaved','goalDate'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  // Nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Animación entrada cards
  const cards = document.querySelectorAll('.goal-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = `opacity 0.35s ease ${i * 0.1}s, transform 0.35s ease ${i * 0.1}s`;
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  });

});