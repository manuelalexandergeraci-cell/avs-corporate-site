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

// Carousel controls
function initCarousels() {
  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(carousel => {
    const id = carousel.getAttribute('id');
    if (!id) return;

    const prevBtn = document.querySelector(`[data-carousel-prev="${id}"]`);
    const nextBtn = document.querySelector(`[data-carousel-next="${id}"]`);

    const getStep = () => {
      const card = carousel.querySelector('.video-card-item');
      if (!card) return carousel.clientWidth;
      const styles = window.getComputedStyle(carousel);
      const gap = parseFloat(styles.columnGap || styles.gap || '0');
      return card.getBoundingClientRect().width + gap;
    };

    const scrollByStep = (direction) => {
      carousel.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
    };

    if (prevBtn) prevBtn.addEventListener('click', () => scrollByStep(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollByStep(1));

    const updateButtons = () => {
      if (!prevBtn || !nextBtn) return;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth - 1;
      prevBtn.disabled = carousel.scrollLeft <= 0;
      nextBtn.disabled = carousel.scrollLeft >= maxScroll;
    };

    carousel.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });
}
initCarousels();

// Video modal
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  if (!modal) return;

  const modalVideo = modal.querySelector('#modalVideo');
  const modalTitle = modal.querySelector('#modalTitle');
  const modalDescription = modal.querySelector('#modalDescription');
  const closeBtn = modal.querySelector('[data-modal-close]');
  const backdrop = modal.querySelector('[data-modal-backdrop]');

  let lastTrigger = null;

  const openModal = (card) => {
    const src = card.getAttribute('data-video');
    if (!src) return;
    const poster = card.getAttribute('data-poster');
    const title = card.getAttribute('data-title') || '';
    const descriptionEl = card.querySelector('.video-description');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) {
      modalDescription.innerHTML = descriptionEl ? descriptionEl.innerHTML : '';
    }

    if (modalVideo) {
      modalVideo.src = src;
      if (poster) modalVideo.poster = poster;
      modalVideo.load();
      modalVideo.play().catch(() => {});
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    lastTrigger = card;
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    document.body.classList.remove('modal-open');

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load();
    }

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  const cards = document.querySelectorAll('.video-card-item[data-video]');
  cards.forEach(card => {
    let startX = 0;
    let startY = 0;
    let moved = false;

    card.addEventListener('pointerdown', (event) => {
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
    });

    card.addEventListener('pointermove', (event) => {
      if (Math.abs(event.clientX - startX) > 8 || Math.abs(event.clientY - startY) > 8) {
        moved = true;
      }
    });

    card.addEventListener('pointerup', () => {
      if (!moved) openModal(card);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card);
      }
    });
  });
}
initVideoModal();
