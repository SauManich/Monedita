// meta.js

document.addEventListener('DOMContentLoaded', () => {

  const container  = document.getElementById('brokenContainer');
  const emptyState = document.getElementById('emptyState');
  const heroTotal  = document.getElementById('heroTotal');

  function loadBroken() {
    const broken = JSON.parse(localStorage.getItem('monedita_broken') || '[]');

    // Total retirado
    const total = broken.reduce((sum, g) => sum + (parseFloat(g.saved) || 0), 0);
    heroTotal.textContent = `Bs.- ${total.toLocaleString('es-BO')}`;

    if (broken.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = '';

    // Más recientes primero
    [...broken].reverse().forEach((goal, i) => {
      const card = document.createElement('div');
      card.className = 'goal-card';

      const date = goal.brokenAt
        ? new Date(goal.brokenAt).toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' })
        : '—';

      card.innerHTML = `
        <div class="card-top">
          <img src="../img/cerdo.png" alt="Piggy" class="piggy-img" />
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-name">${goal.name}</span>
              <span class="card-badge">Rota</span>
            </div>
            <p class="card-amount">
              Retirado: <span>Bs.- ${parseFloat(goal.saved).toLocaleString('es-BO')}</span>
              &nbsp;/&nbsp; Meta: Bs.- ${parseFloat(goal.amount).toLocaleString('es-BO')}
            </p>
            <p class="card-date"><i class="iconoir-calendar"></i> ${date}</p>
          </div>
        </div>
      `;

      // Animación entrada
      card.style.opacity = '0';
      card.style.transform = 'translateY(14px)';
      card.style.transition = `opacity 0.35s ease ${i * 0.08}s, transform 0.35s ease ${i * 0.08}s`;
      container.appendChild(card);
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
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

  loadBroken();
});