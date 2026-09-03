document.addEventListener('DOMContentLoaded', () => {

  /* ================= HEADER SCROLL STATE ================= */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  /* ================= MOBILE NAV TOGGLE ================= */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ================= HERO SLIDER ================= */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  let current = slides.findIndex(s => s.classList.contains('is-active'));
  if (current === -1) current = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 5500;

  // build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === current ? ' is-active' : '');
    dot.setAttribute('aria-label', `Ke slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
    });
  }

  function goToSlide(index) {
    slides[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    updateDots();
    restartAutoplay();
  }

  function nextSlide() { goToSlide(current + 1); }
  function prevSlide() { goToSlide(current - 1); }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  restartAutoplay();

  // pause autoplay on hover / focus
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  heroEl.addEventListener('mouseleave', restartAutoplay);

  /* ===== SWIPE GESTURE (mobile) ===== */
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 40;

  heroEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(autoplayTimer);
  }, { passive: true });

  heroEl.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff < 0 ? nextSlide() : prevSlide();
    } else {
      restartAutoplay();
    }
  }, { passive: true });

  /* ================= GALLERY SLIDER (MOBILE) ================= */
  const gallery = document.querySelector('.gallery');
  const galleryDots = document.getElementById('galleryDots');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (gallery && galleryDots && galleryItems.length > 0 && window.innerWidth <= 640) {
    // Create dots for each gallery item
    galleryItems.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      dot.type = 'button';
      
      dot.addEventListener('click', () => {
        const itemWidth = item.offsetWidth + 12; // include gap
        gallery.scrollTo({
          left: index * itemWidth,
          behavior: 'smooth'
        });
      });
      
      galleryDots.appendChild(dot);
    });
    
    // Update active dot on scroll
    let scrollTimeout;
    gallery.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = gallery.scrollLeft;
        const itemWidth = galleryItems[0].offsetWidth + 12;
        const currentIndex = Math.round(scrollLeft / itemWidth);
        
        document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }, 50);
    }, { passive: true });
    
    // Add swipe gesture support
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallery.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    gallery.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      const itemWidth = galleryItems[0].offsetWidth + 12;
      
      if (Math.abs(diff) > 50) {
        // Swipe detected, snap to next/prev item
        const currentIndex = Math.round(gallery.scrollLeft / itemWidth);
        const nextIndex = diff > 0 ? currentIndex + 1 : currentIndex - 1;
        
        if (nextIndex >= 0 && nextIndex < galleryItems.length) {
          gallery.scrollTo({
            left: nextIndex * itemWidth,
            behavior: 'smooth'
          });
        }
      }
    }, { passive: true });
  }

  /* ================= MODAL POPUP UNIT ARMADA ================= */
  const WA_NUMBER = '6281553774404';
  const modal = document.getElementById('unitModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalWaBtn = document.getElementById('modalWaBtn');
  let lastFocusedEl = null;

  function openModal(item) {
    const title = item.dataset.title || 'Unit Orc Transportasi';
    const desc = item.dataset.desc || '';
    const img = item.dataset.img || item.querySelector('img').src;

    modalImg.src = "img/photo_2026-08-28_13-30-09.jpg";
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    const text = encodeURIComponent(`Halo Orc Transportasi, saya tertarik dengan unit "${title}". Bisa minta info lebih lanjut?`);
    modalWaBtn.href = `https://wa.me/${WA_NUMBER}?text=${text}`;

    lastFocusedEl = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openModal(item));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item);
      }
    });
  });

  modal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });


  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ================= COUNTER ANIMATION ================= */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ================= ACTIVE NAV LINK ON SCROLL ================= */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

});
// ==========================================
// GOOGLE REVIEWS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  const reviewsList =
    document.getElementById("reviews-list");

  const loading =
    document.getElementById("reviews-loading");

  const errorBox =
    document.getElementById("reviews-error");

  const ratingValue =
    document.getElementById("google-rating-value");

  const ratingStars =
    document.getElementById("google-stars");

  const totalReviews =
    document.getElementById("google-total-reviews");

  const writeReviewBtn =
    document.getElementById("write-review-btn");


  // Jangan jalankan kalau section tidak ada
  if (!reviewsList) return;


  // ========================================
  // FORMAT RATING
  // ========================================

  function createStars(rating) {

    const rounded =
      Math.round(Number(rating));

    return "★".repeat(rounded) +
           "☆".repeat(5 - rounded);
  }


  // ========================================
  // FORMAT TANGGAL
  // ========================================

  function formatDate(dateString) {

    if (!dateString) {
      return "";
    }

    const date =
      new Date(dateString);

    return date.toLocaleDateString(
      "id-ID",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
  }


  // ========================================
  // ESCAPE HTML
  // ========================================

  function escapeHTML(value) {

    const div =
      document.createElement("div");

    div.textContent =
      value ?? "";

    return div.innerHTML;
  }


  // ========================================
  // LOAD REVIEWS
  // ========================================

  fetch("get-reviews.php")

    .then(response => {

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil data ulasan."
        );
      }

      return response.json();

    })

    .then(data => {

      if (!data.success) {
        throw new Error(
          data.message ||
          "Gagal mengambil ulasan."
        );
      }


      // ======================================
      // RATING
      // ======================================

      const rating =
        Number(data.business.rating || 0);

      const total =
        Number(
          data.business.total_reviews || 0
        );


      ratingValue.textContent =
        rating.toFixed(1);

      ratingStars.textContent =
        createStars(rating);

      totalReviews.textContent =
        `${total.toLocaleString("id-ID")} ulasan Google`;


      // ======================================
      // LINK TULIS ULASAN
      // ======================================

      if (
        data.google &&
        data.google.write_review_url
      ) {

        writeReviewBtn.href =
          data.google.write_review_url;

      } else if (
        data.google &&
        data.google.reviews_url
      ) {

        writeReviewBtn.href =
          data.google.reviews_url;

      } else {

        writeReviewBtn.href =
          "https://www.google.com/maps";
      }


      // ======================================
      // REVIEW
      // ======================================

      reviewsList.innerHTML = "";


      if (
        !data.reviews ||
        data.reviews.length === 0
      ) {

        reviewsList.innerHTML = `
          <div class="no-reviews">
            <p>
              Belum ada ulasan yang dapat ditampilkan.
            </p>
          </div>
        `;

        return;
      }


      data.reviews.forEach(review => {

        const card =
          document.createElement("article");

        card.className =
          "review-card";


        const photo =
          review.profile_photo_url
          ? `
            <img
              src="${escapeHTML(review.profile_photo_url)}"
              alt="${escapeHTML(review.author_name)}"
              class="review-avatar"
              loading="lazy"
            >
          `
          : `
            <div class="review-avatar review-avatar--default">
              ${escapeHTML(
                review.author_name
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>
          `;


        const reviewLink =
          review.google_maps_uri
          ? `
            <a
              href="${escapeHTML(review.google_maps_uri)}"
              target="_blank"
              rel="noopener"
              class="review-google-link">
              Lihat di Google
            </a>
          `
          : "";


        card.innerHTML = `

          <div class="review-header">

            ${photo}

            <div class="review-author">

              <strong>
                ${escapeHTML(
                  review.author_name
                )}
              </strong>

              <div class="review-stars">
                ${createStars(
                  review.rating
                )}
              </div>

            </div>

          </div>


          <div class="review-google">
            <span>Google</span>
          </div>


          <p class="review-text">
            "${escapeHTML(
              review.text
            )}"
          </p>


          <div class="review-footer">

            <span class="review-date">
              ${formatDate(
                review.publish_time
              )}
            </span>

            ${reviewLink}

          </div>

        `;


        reviewsList.appendChild(card);

      });

    })

    .catch(error => {

      console.error(
        "Google Reviews:",
        error
      );

      errorBox.style.display =
        "block";

    })

    .finally(() => {

      loading.style.display =
        "none";

    });

});

/* =========================================================
   ENHANCED MOBILE ANIMATIONS
   Staggered animations for cards, gallery items, and sections
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  // Check if device prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Check if touch device
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  };

  // ===== STAGGERED CARD ANIMATIONS =====
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stagger animation for each card
        const delay = index * 0.1;
        entry.target.style.animationDelay = `${delay}s`;
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply staggered animation to cards
  document.querySelectorAll('.card').forEach((card, index) => {
    card.style.setProperty('--stagger-index', index);
    cardObserver.observe(card);
  });

  // ===== GALLERY ITEM ANIMATIONS WITH PARALLAX =====
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Add parallax effect on scroll for gallery items
        if (isTouchDevice()) {
          // Lighter parallax for touch devices
          window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const rect = entry.target.getBoundingClientRect();
            const parallax = (scrollY - rect.top) * 0.05;
            entry.target.style.transform = `translateY(${parallax}px)`;
          }, { passive: true });
        }
        
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.gallery-item').forEach((item) => {
    galleryObserver.observe(item);
  });

  // ===== SECTION ENTRANCE ANIMATIONS =====
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated-in')) {
        entry.target.classList.add('animated-in');
        const items = entry.target.querySelectorAll('.reveal, .card, .gallery-item');
        items.forEach((item, idx) => {
          item.style.setProperty('--item-index', idx);
        });
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -100px 0px' });

  document.querySelectorAll('section').forEach((section) => {
    sectionObserver.observe(section);
  });

  // ===== TOUCH FEEDBACK ANIMATIONS =====
  if (isTouchDevice()) {
    document.querySelectorAll('.btn, .gallery-item, .card').forEach((element) => {
      element.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.15s ease-out';
      }, { passive: true });

      element.addEventListener('touchend', function() {
        this.style.transform = '';
        this.style.transition = 'transform 0.3s cubic-bezier(.4,0,.2,1)';
      }, { passive: true });
    });
  }

  // ===== SCROLL ANIMATION FOR HERO =====
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const parallaxFactor = scrollY * 0.5;
      const opacity = Math.max(0, 1 - (scrollY / 600));
      
      const slides = hero.querySelectorAll('.slide');
      slides.forEach((slide) => {
        slide.style.transform = `translateY(${parallaxFactor}px)`;
      });
      
      const content = hero.querySelector('.slide-content');
      if (content) {
        content.style.opacity = opacity;
      }
    }, { passive: true });
  }

  // ===== BUTTON RIPPLE EFFECT =====
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'rippleAnim 0.6s ease-out';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

});

/* Add ripple animation keyframe if not exists */
if (!document.querySelector('style[data-ripple]')) {
  const style = document.createElement('style');
  style.setAttribute('data-ripple', 'true');
  style.textContent = `
    @keyframes rippleAnim {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/* =========================================================
   TILT 3D — efek kemiringan kartu mengikuti posisi mouse
   File terpisah & aditif, tidak mengubah script.js yang sudah ada.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Hanya aktifkan di perangkat dengan mouse presisi (bukan layar sentuh)
  const hasFineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFineHover) return;

  const TILT_TARGETS = [
    { selector: '.card', maxTilt: 10, lift: -8, scale: 1.015 },
    { selector: '.gallery-item', maxTilt: 7, lift: -6, scale: 1.02 },
    { selector: '.pf-item', maxTilt: 6, lift: -6, scale: 1.015 },
    { selector: '.review-card', maxTilt: 5, lift: -5, scale: 1.01 }
  ];

  TILT_TARGETS.forEach(({ selector, maxTilt, lift, scale }) => {
    document.querySelectorAll(selector).forEach(el => {

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * maxTilt;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;

        el.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${lift}px) scale(${scale})`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.1s ease-out';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)';
      });
    });
  });

});