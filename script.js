document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const heroVisual = document.querySelector('.profile-shell');
  if (heroVisual) {
    heroVisual.style.transition = 'transform 0.2s ease';

    window.addEventListener('pointermove', (event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 12;
      const y = (event.clientY / innerHeight - 0.5) * 12;

      heroVisual.style.transform = `rotateX(${(-y).toFixed(2)}deg) rotateY(${x.toFixed(2)}deg) translateY(-4px)`;
    });
  }

  const existingDots = document.querySelector('.pulse-dots');
  if (!existingDots) {
    const pulseDots = document.createElement('div');
    pulseDots.className = 'pulse-dots';

    for (let i = 0; i < 16; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'pulse-dot';

      const size = 8 + Math.random() * 18;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 6 + Math.random() * 8;

      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${left}%`;
      dot.style.top = `${top}%`;
      dot.style.animationDelay = `${delay}s`;
      dot.style.animationDuration = `${duration}s`;

      pulseDots.appendChild(dot);
    }

    document.body.appendChild(pulseDots);
  }

  const slides = [...document.querySelectorAll('.slide')];
  const slideDots = [...document.querySelectorAll('.slide-dot')];
  const prevButton = document.querySelector('.slide-btn.prev');
  const nextButton = document.querySelector('.slide-btn.next');

  if (slides.length) {
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, idx) => {
        slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

        const offset = (idx - currentSlide + slides.length) % slides.length;

        if (offset === 0) {
          slide.classList.add('active');
        } else if (offset === 1) {
          slide.classList.add('next');
        } else if (offset === slides.length - 1) {
          slide.classList.add('prev');
        } else if (offset === 2) {
          slide.classList.add('far-next');
        } else if (offset === slides.length - 2) {
          slide.classList.add('far-prev');
        }
      });

      slideDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    };

    const startAutoSlide = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 2600);
    };

    const mediaSlideshow = document.querySelector('.media-slideshow');
    if (mediaSlideshow) {
      mediaSlideshow.addEventListener('pointermove', (event) => {
        const rect = mediaSlideshow.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        mediaSlideshow.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
      });

      mediaSlideshow.addEventListener('pointerleave', () => {
        mediaSlideshow.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    }

    prevButton?.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoSlide();
    });

    nextButton?.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoSlide();
    });

    slideDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.index));
        startAutoSlide();
      });
    });

    showSlide(0);
    startAutoSlide();
  }
});

