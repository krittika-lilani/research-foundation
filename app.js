const investigativePanel = document.querySelector(".investigative-panel");
const investigativeSection = document.querySelector(
  ".investigative-sequence",
);
const investigativeStage = document.querySelector(".investigative-stage");
const precedentImage = document.querySelector(".precedent-image");
const investigativeQuote = document.querySelector(".investigative-quote");

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

let investigativeProgress = 0;
let investigativeTransitioning = false;

function renderInvestigativeTransition(progress) {
  investigativeProgress = clamp(progress, 0, 1);
  const quoteProgress = clamp(investigativeProgress, 0, 1);
  const stageScale = investigativeStage.clientWidth / 1440;
  const quoteWidth = investigativeQuote.offsetWidth / stageScale;
  const quoteHeight = investigativeQuote.offsetHeight / stageScale;
  const bombImageLeft = 538;
  const bombImageBottom = 753;
  const finalQuoteX = bombImageLeft - 30 - quoteWidth;
  const finalQuoteY = bombImageBottom - quoteHeight;
  const quoteX = 791 + (finalQuoteX - 791) * quoteProgress;
  const quoteY = 512 + (finalQuoteY - 512) * quoteProgress;

  investigativeQuote.style.left = `${(quoteX / 1440) * 100}%`;
  investigativeQuote.style.top = `${(quoteY / 900) * 100}%`;
  precedentImage.style.opacity = 1 - quoteProgress;
  investigativePanel.classList.toggle(
    "is-bomb-visible",
    quoteProgress === 1,
  );
}

function animateInvestigativeTransition(targetProgress, onComplete) {
  if (investigativeTransitioning) return;

  investigativeTransitioning = true;
  const startProgress = investigativeProgress;
  const startTime = performance.now();
  const duration = 1400;

  function animate(now) {
    const elapsed = clamp((now - startTime) / duration, 0, 1);
    const eased =
      elapsed < 0.5
        ? 4 * elapsed * elapsed * elapsed
        : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
    const progress =
      startProgress + (targetProgress - startProgress) * eased;

    renderInvestigativeTransition(progress);

    if (elapsed < 1) {
      window.requestAnimationFrame(animate);
      return;
    }

    investigativeTransitioning = false;
    onComplete?.();
  }

  window.requestAnimationFrame(animate);
}

function revealInvestigativeStep() {
  if (!investigativePanel.classList.contains("is-quote-revealed")) {
    investigativePanel.classList.add("is-quote-revealed");
  }
}

window.addEventListener("resize", () =>
  renderInvestigativeTransition(investigativeProgress),
);
renderInvestigativeTransition(0);

const potentialPanel = document.querySelector(".potential-panel");
let potentialClickCount = 0;

function revealPotentialStep() {
  potentialClickCount += 1;

  if (potentialClickCount === 1) {
    potentialPanel.classList.add("is-caption-visible");
  } else if (potentialClickCount === 2) {
    potentialPanel.classList.add("is-fragmentation-visible");
    window.setTimeout(() => {
      potentialPanel.classList.add("is-separation-visible");
    }, 200);
    window.setTimeout(() => {
      potentialPanel.classList.add("is-reopening-visible");
    }, 400);
  } else if (potentialClickCount === 3) {
    potentialPanel.classList.add("is-descriptions-visible");
  }
}

const lydPanel = document.querySelector(".lyd-panel");
const lydVideo = document.querySelector(".lyd-video");
let lydClickCount = 0;

function revealLydStep() {
  lydClickCount += 1;

  if (lydClickCount === 1) {
    lydPanel.classList.add("is-caption-visible");
  } else if (lydClickCount === 2) {
    lydPanel.classList.add("is-video-visible");
    lydVideo.currentTime = 0;
    lydVideo.play().catch(() => {});
    window.setTimeout(() => {
      lydPanel.classList.add("is-animated-visible");
      lydPanel.classList.add("is-real-visible");
    }, 1000);
  }
}

const dimensionalityPanel = document.querySelector(
  ".dimensionality-panel",
);
let dimensionalityClickCount = 0;

function revealDimensionalityStep() {
  dimensionalityClickCount += 1;

  if (dimensionalityClickCount === 1) {
    dimensionalityPanel.classList.add("is-caption-visible");
  } else if (dimensionalityClickCount === 2) {
    dimensionalityPanel.classList.add("is-final-visible");
  }
}

investigativePanel.addEventListener("click", revealInvestigativeStep);
potentialPanel.addEventListener("click", revealPotentialStep);
lydPanel.addEventListener("click", revealLydStep);
dimensionalityPanel.addEventListener(
  "click",
  revealDimensionalityStep,
);

const materialGesturePanel = document.querySelector(
  ".material-gesture-panel",
);
const materialStates = Array.from(
  materialGesturePanel.querySelectorAll(".material-state"),
);
let materialSequenceStarted = false;

function runMaterialSequence() {
  if (materialSequenceStarted) return;
  materialSequenceStarted = true;

  let currentState = 0;

  function showNextMaterialState() {
    const nextState = currentState + 1;
    if (nextState >= materialStates.length) return;

    if (nextState >= 2) {
      materialStates[currentState].style.transition = "none";
      materialStates[nextState].style.transition = "none";
    }

    materialStates[nextState].style.opacity = 1;
    materialStates[currentState].style.opacity = 0;
    currentState = nextState;

    if (currentState < materialStates.length - 1) {
      window.setTimeout(showNextMaterialState, 600);
    }
  }

  window.setTimeout(showNextMaterialState, 1400);
}

const materialObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) {
    runMaterialSequence();
    materialObserver.disconnect();
  }
});

materialObserver.observe(materialGesturePanel);

const allTogetherPanel = document.querySelector(
  ".all-together-panel",
);

function revealAllTogetherStep() {
  allTogetherPanel.classList.add("is-final-visible");
}

allTogetherPanel.addEventListener("click", revealAllTogetherStep);

const kashmirPanel = document.querySelector(".kashmir-panel");
const kashmirStates = Array.from(
  kashmirPanel.querySelectorAll(".kashmir-state"),
);
let kashmirStateIndex = 0;

function revealKashmirStep() {
  if (kashmirStateIndex >= kashmirStates.length - 1) return;

  const nextStateIndex = kashmirStateIndex + 1;
  kashmirStates[nextStateIndex].style.opacity = 1;
  kashmirStates[kashmirStateIndex].style.opacity = 0;
  kashmirStateIndex = nextStateIndex;
}

kashmirPanel.addEventListener("click", revealKashmirStep);

function revealVisiblePanelStep() {
  const revealPanels = [
    { element: investigativePanel, reveal: revealInvestigativeStep },
    { element: potentialPanel, reveal: revealPotentialStep },
    {
      element: document.querySelector(".lyd-section"),
      reveal: revealLydStep,
    },
    {
      element: dimensionalityPanel,
      reveal: revealDimensionalityStep,
    },
    {
      element: allTogetherPanel,
      reveal: revealAllTogetherStep,
    },
    {
      element: kashmirPanel,
      reveal: revealKashmirStep,
    },
  ];

  const activePanel = revealPanels
    .map((panel) => {
      const bounds = panel.element.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(bounds.bottom, window.innerHeight) -
          Math.max(bounds.top, 0),
      );
      return { ...panel, visibleHeight };
    })
    .sort((a, b) => b.visibleHeight - a.visibleHeight)[0];

  if (activePanel?.visibleHeight > 0) activePanel.reveal();
}

function handleSpacebarReveal(event) {
  const isSpacebar =
    event.code === "Space" ||
    event.key === " " ||
    event.key === "Spacebar";

  const target = event.target;
  const isEditable =
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.matches("input, textarea, select, button"));

  if (isSpacebar && !event.repeat && !isEditable) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    revealVisiblePanelStep();
  }
}

document.addEventListener("keydown", handleSpacebarReveal, true);
document.addEventListener(
  "pointerdown",
  () => document.body.focus({ preventScroll: true }),
  true,
);

let bombResultLocked = false;
let bombResultAnimationComplete = false;
let bombResultQuietTimer = 0;
let bombResultFadeTimer = 0;
let fullPageController = null;
const fullPageSectionStorageKey = "research-foundation-active-section";
const fullPageSectionCount = document.querySelectorAll(
  "#fullpage > .section",
).length;
const savedFullPageSectionIndex = Number.parseInt(
  window.sessionStorage.getItem(fullPageSectionStorageKey) ?? "0",
  10,
);
const reloadFullPageSectionIndex = Number.isInteger(savedFullPageSectionIndex)
  ? clamp(savedFullPageSectionIndex, 0, fullPageSectionCount - 1)
  : 0;
let restoringFullPageSection = reloadFullPageSectionIndex > 0;

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function unlockBombResultSection() {
  window.clearTimeout(bombResultQuietTimer);
  bombResultLocked = false;
  fullPageController?.setAllowScrolling(true);
}

function waitForFreshWheelGesture() {
  window.clearTimeout(bombResultQuietTimer);
  bombResultQuietTimer = window.setTimeout(unlockBombResultSection, 280);
}

function playBombResultSection() {
  window.clearTimeout(bombResultFadeTimer);
  window.clearTimeout(bombResultQuietTimer);
  bombResultLocked = true;
  bombResultAnimationComplete = false;
  fullPageController?.setAllowScrolling(false);
  fullPageController?.setKeyboardScrolling(false);
  investigativePanel.classList.add("is-quote-revealed");
  renderInvestigativeTransition(0);

  animateInvestigativeTransition(1, () => {
    bombResultFadeTimer = window.setTimeout(() => {
      bombResultAnimationComplete = true;
      fullPageController?.setKeyboardScrolling(true);
      waitForFreshWheelGesture();
    }, 1400);
  });
}

document.addEventListener(
  "wheel",
  (event) => {
    if (!bombResultLocked) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (bombResultAnimationComplete) waitForFreshWheelGesture();
  },
  { capture: true, passive: false },
);

if (window.fullpage) {
  fullPageController = new fullpage("#fullpage", {
    licenseKey: "",
    sectionSelector: ".section",
    autoScrolling: true,
    fitToSection: true,
    scrollingSpeed: 1100,
    keyboardScrolling: true,
    recordHistory: false,
    scrollBar: false,
    verticalCentered: false,
    afterRender() {
      if (!restoringFullPageSection) return;

      window.setTimeout(() => {
        fullPageController?.silentMoveTo(reloadFullPageSectionIndex + 1);
      }, 0);
    },
    onLeave(origin, destination, direction) {
      if (origin.item !== investigativeSection) return true;
      if (bombResultLocked) return false;

      if (direction === "down" && investigativeProgress < 1) {
        playBombResultSection();
        return false;
      }

      return true;
    },
    afterLoad(origin, destination, direction) {
      if (destination.item === investigativeSection) {
        renderInvestigativeTransition(direction === "up" ? 1 : 0);
      }

      if (
        restoringFullPageSection &&
        destination.index !== reloadFullPageSectionIndex
      ) {
        return;
      }

      restoringFullPageSection = false;
      window.sessionStorage.setItem(
        fullPageSectionStorageKey,
        String(destination.index),
      );
    },
  });
}
