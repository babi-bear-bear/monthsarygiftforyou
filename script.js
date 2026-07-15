/* ================================================================
   MONTHSARY LOVE LETTER — INTERACTIONS
   The most commonly edited settings are grouped directly below.
   ================================================================ */

// EDIT HERE: Use YYYY-MM-DD format for your relationship start date.
const RELATIONSHIP_START_DATE = "2026-05-10";

// EDIT HERE: Change the readable date shown below the day counter.
const RELATIONSHIP_START_LABEL = "May 10, 2026";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;

// Add a soft field of glowing particles without external libraries.
function createAmbientParticles() {
  const particleField = document.querySelector("#particleField");
  if (!particleField || prefersReducedMotion) return;

  for (let index = 0; index < 24; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${30 + Math.random() * 100}%`;
    particle.style.setProperty("--size", `${2 + Math.random() * 3}px`);
    particle.style.setProperty("--duration", `${13 + Math.random() * 15}s`);
    particle.style.setProperty("--delay", `${Math.random() * -20}s`);
    particleField.appendChild(particle);
  }
}

// Reveal content gently as it enters the viewport.
function initializeScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px" }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
    observer.observe(element);
  });
}

// Give the fixed navigation a glass background after scrolling.
function initializeHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// Show elegant placeholders if personal gallery files have not been added yet.
function initializeGallery() {
  const photoCards = document.querySelectorAll(".photo-card");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxPlaceholder = document.querySelector("#lightboxPlaceholder");
  const lightboxCaption = document.querySelector("#lightboxCaption");
  const lightboxClose = document.querySelector("#lightboxClose");

  photoCards.forEach((card) => {
    const image = card.querySelector("img");

    image.addEventListener("error", () => card.classList.add("image-missing"));
    if (image.complete && image.naturalWidth === 0) card.classList.add("image-missing");

    card.addEventListener("click", () => {
      const isMissing = card.classList.contains("image-missing");
      lightboxCaption.textContent = card.dataset.caption;
      lightboxImage.alt = card.querySelector("img").alt;
      lightboxImage.hidden = isMissing;
      lightboxPlaceholder.hidden = !isMissing;

      if (!isMissing) lightboxImage.src = card.dataset.image;
      lightbox.showModal();
      body.classList.add("modal-open");
    });
  });

  const closeLightbox = () => {
    lightbox.close();
    body.classList.remove("modal-open");
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("close", () => body.classList.remove("modal-open"));
}

// Animate the envelope first, then raise the full editable letter.
function initializeLetter() {
  const letterStage = document.querySelector(".letter-stage");
  const letterPaper = document.querySelector("#letterPaper");
  const openLetterButton = document.querySelector("#openLetter");
  const closeLetterButton = document.querySelector("#closeLetter");

  const openLetter = () => {
    letterStage.classList.add("opening");
    openLetterButton.textContent = "A letter from my heart";

    window.setTimeout(() => {
      letterPaper.classList.add("visible");
      letterPaper.setAttribute("aria-hidden", "false");
      body.classList.add("modal-open");
      closeLetterButton.focus();
    }, prefersReducedMotion ? 0 : 650);
  };

  const closeLetter = () => {
    letterPaper.classList.remove("visible");
    letterPaper.setAttribute("aria-hidden", "true");
    letterStage.classList.remove("opening");
    openLetterButton.textContent = "Open my letter";
    body.classList.remove("modal-open");
    openLetterButton.focus();
  };

  openLetterButton.addEventListener("click", openLetter);
  closeLetterButton.addEventListener("click", closeLetter);
}

// Each reason can be opened and closed independently.
function initializeReasons() {
  document.querySelectorAll(".reason-card").forEach((card) => {
    card.setAttribute("aria-pressed", "false");
    card.addEventListener("click", () => {
      const isFlipped = card.classList.toggle("flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
    });
  });
}

// Calculate full calendar days together using UTC to avoid timezone shifts.
function initializeDayCounter() {
  const counter = document.querySelector("#daysTogether");
  const label = document.querySelector("#relationshipStartLabel");
  const startDate = new Date(`${RELATIONSHIP_START_DATE}T00:00:00Z`);
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const daysTogether = Math.max(0, Math.floor((todayUtc - startDate.getTime()) / 86400000));

  label.textContent = `Since ${RELATIONSHIP_START_LABEL}`;

  if (prefersReducedMotion) {
    counter.textContent = daysTogether;
    return;
  }

  const duration = 1400;
  const startTime = performance.now();

  const animateCount = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(daysTogether * easedProgress);
    if (progress < 1) requestAnimationFrame(animateCount);
  };

  requestAnimationFrame(animateCount);
}

// The audio never autoplays. Missing files produce a friendly editable hint.
function initializeMusicPlayer() {
  const player = document.querySelector("#musicPlayer");
  const audio = document.querySelector("#loveSong");
  const toggle = document.querySelector("#musicToggle");
  const status = document.querySelector("#musicStatus");

  const setPlayingState = (isPlaying) => {
    player.classList.toggle("playing", isPlaying);
    toggle.setAttribute("aria-label", isPlaying ? "Pause our song" : "Play our song");
    status.textContent = isPlaying ? "Now playing" : "Tap to play";
  };

  toggle.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch (error) {
      status.textContent = "Add our-song.mp3";
      player.classList.remove("playing");
    }
  });

  audio.addEventListener("play", () => setPlayingState(true));
  audio.addEventListener("pause", () => setPlayingState(false));
  audio.addEventListener("ended", () => setPlayingState(false));
  audio.addEventListener("error", () => {
    status.textContent = "Add our-song.mp3";
    player.classList.remove("playing");
  });
}

// Create the secret confetti and floating-heart celebration.
function celebrate() {
  const layer = document.querySelector("#celebrationLayer");
  const colors = ["#b86673", "#edcfd3", "#d4c5e0", "#b79865", "#fff7f2"];
  const totalPieces = prefersReducedMotion ? 18 : 85;

  for (let index = 0; index < totalPieces; index += 1) {
    const isHeart = index % 5 === 0;
    const piece = document.createElement("span");
    piece.className = isHeart ? "floating-love-heart" : "confetti-piece";
    piece.textContent = isHeart ? "♥" : "";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--piece-color", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.setProperty("--drift", `${-100 + Math.random() * 200}px`);
    piece.style.setProperty("--rotation", `${-360 + Math.random() * 720}deg`);
    piece.style.setProperty("--fall-time", `${2.5 + Math.random() * 2.8}s`);
    piece.style.setProperty("--heart-size", `${0.8 + Math.random() * 1.4}rem`);
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    layer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 6200);
  }
}

function initializeSecretSurprise() {
  const secretHeart = document.querySelector("#secretHeart");
  const modal = document.querySelector("#surpriseModal");
  const closeButton = document.querySelector("#surpriseClose");

  const openSurprise = () => {
    modal.classList.add("visible");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    celebrate();
    closeButton.focus();
  };

  const closeSurprise = () => {
    modal.classList.remove("visible");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    secretHeart.focus();
  };

  secretHeart.addEventListener("click", openSurprise);
  closeButton.addEventListener("click", closeSurprise);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeSurprise();
  });
}

// Close open overlays with the Escape key.
function initializeKeyboardControls() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const letterPaper = document.querySelector("#letterPaper");
    const surpriseModal = document.querySelector("#surpriseModal");

    if (letterPaper.classList.contains("visible")) document.querySelector("#closeLetter").click();
    if (surpriseModal.classList.contains("visible")) document.querySelector("#surpriseClose").click();
  });
}

createAmbientParticles();
initializeScrollReveals();
initializeHeader();
initializeGallery();
initializeLetter();
initializeReasons();
initializeDayCounter();
initializeMusicPlayer();
initializeSecretSurprise();
initializeKeyboardControls();
