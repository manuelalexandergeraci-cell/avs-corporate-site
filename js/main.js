// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
  });
}

// Lazy video embeds (supporta più video)
function initVideoEmbeds() {
  const frames = document.querySelectorAll('[data-embed]');
  frames.forEach(frame => {
    const overlay = frame.querySelector('.video-overlay');
    const iframe = frame.querySelector('iframe');
    const play = frame.querySelector('.play');

    if (!overlay || !iframe || !play) return;

    const start = () => {
      const url = frame.getAttribute('data-embed');
      if (!url) return;
      iframe.src = url;
      iframe.style.display = 'block';
      overlay.style.display = 'none';
    };

    play.addEventListener('click', start);
    play.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') start();
    });
  });
}
initVideoEmbeds();
