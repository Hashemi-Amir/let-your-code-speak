/* ==========================================
   Navigation Menu
   ========================================== */

document.addEventListener("DOMContentLoaded", function initNavMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const navItems = document.querySelectorAll(".nav-item");

  if (!navMenu || !menuToggle) return;

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target)) {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  });
});

/* ==========================================
   Tab Menu
   ========================================== */

document.addEventListener("DOMContentLoaded", function initTabMenu() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabBtns.length || !tabContents.length) return;

  function switchTab(tabId) {
    tabBtns.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const activeContent = document.querySelector(
      `.tab-content[data-tab-content="${tabId}"]`
    );

    if (activeBtn) activeBtn.classList.add("active");
    if (activeContent) activeContent.classList.add("active");
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
});

/* ==========================================
   Image Slider
   ========================================== */

document.addEventListener("DOMContentLoaded", function initSlider() {
  const sliderTrack = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.querySelector(".slider-btn-prev");
  const nextBtn = document.querySelector(".slider-btn-next");

  if (!sliderTrack || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function getSlideMetrics() {
    const firstSlide = slides[0];
    const slideWidth = firstSlide.offsetWidth;
    const trackStyle = window.getComputedStyle(sliderTrack);
    const slideGap = parseInt(trackStyle.gap) || 24;
    return { slideWidth, slideGap };
  }

  function updateSlider() {
    const wrapper = sliderTrack.closest(".slider-wrapper");
    const wrapperWidth = wrapper.offsetWidth;
    const { slideWidth, slideGap } = getSlideMetrics();
    const slideFullWidth = slideWidth + slideGap;
    const slideCenterOffset = (wrapperWidth - slideWidth) / 2;
    const currentSlidePosition =
      (totalSlides - 1 - currentIndex) * slideFullWidth;
    const trackOffset = slideCenterOffset - currentSlidePosition;

    sliderTrack.style.transform = `translateX(${trackOffset}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // RTL keyboard navigation: left arrow goes next, right arrow goes prev
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") nextSlide();
    if (e.key === "ArrowRight") prevSlide();
  });

  updateSlider();
});

/* ==========================================
   Video Modal
   ========================================== */

document.addEventListener("DOMContentLoaded", function initVideoModal() {
  const modal = document.getElementById("videoModal");
  const modalThumbnail = document.getElementById("modalThumbnail");
  const closeBtn = modal.querySelector(".video-modal-close");
  const backdrop = modal.querySelector(".video-modal-backdrop");
  const playBtns = document.querySelectorAll(".tab-play-btn");

  if (!modal || !playBtns.length) return;

  function openModal(thumbnailSrc) {
    if (modalThumbnail && thumbnailSrc) {
      modalThumbnail.src = thumbnailSrc;
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    // Check if mobile (bottom sheet animation)
    if (window.innerWidth <= 768) {
      modal.classList.add("closing");
      // Wait for animation to complete before hiding
      setTimeout(() => {
        modal.classList.remove("active", "closing");
        document.body.style.overflow = "";
      }, 300);
    } else {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  playBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mediaCard = btn.closest(".tab-media-card");
      const thumbnail = mediaCard?.querySelector(".thumbnail");
      const thumbnailSrc = thumbnail?.src || "";
      openModal(thumbnailSrc);
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});

/* ==========================================
   Signup Form
   ========================================== */

document.addEventListener("DOMContentLoaded", function initSignupForm() {
  const form = document.getElementById("signupForm");
  const signupContent = document.querySelector(".signup-content");
  const signupResult = document.getElementById("signupResult");
  const backBtn = document.getElementById("backBtn");

  if (!form) return;

  const usernameInput = document.getElementById("username");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const submitBtn = form.querySelector(".btn-primary");
  const cancelBtn = form.querySelector(".btn-secondary");
  const passwordToggle = form.querySelector(".password-toggle");

  const usernameGroup = usernameInput.closest(".form-group");
  const phoneGroup = phoneInput.closest(".form-group");
  const passwordGroup = passwordInput.closest(".form-group");

  const requirements = {
    length: document.querySelector('[data-requirement="length"]'),
    number: document.querySelector('[data-requirement="number"]'),
    special: document.querySelector('[data-requirement="special"]'),
  };

  const validationState = {
    username: false,
    phone: false,
    password: { length: false, number: false, special: false },
  };

  function validateUsername(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, error: false };

    const validPattern = /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z\s]+$/;
    const isValid = validPattern.test(trimmed) && trimmed.length >= 2;
    const hasError = trimmed.length > 0 && !validPattern.test(trimmed);

    return { valid: isValid, error: hasError };
  }

  function validatePhone(value) {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned) return { valid: false, error: false };

    const phonePattern = /^09\d{9}$/;
    const isValid = phonePattern.test(cleaned);
    const hasError = cleaned.length > 0 && cleaned.length >= 11 && !isValid;

    return { valid: isValid, error: hasError };
  }

  function validatePassword(value) {
    return {
      length: value.length >= 8,
      number: /\d/.test(value),
      special: /[?#@!*^%$&%\-؟]/.test(value),
    };
  }

  function updateGroupState(group, input, validation) {
    group.classList.remove("filled", "valid", "error");

    if (input.value.trim()) {
      group.classList.add("filled");
    }

    if (validation.valid) {
      group.classList.add("valid");
    } else if (validation.error) {
      group.classList.add("error");
    }
  }

  function updatePasswordRequirements(validation) {
    Object.keys(validation).forEach((key) => {
      const req = requirements[key];
      if (req) {
        req.classList.toggle("valid", validation[key]);
      }
    });

    validationState.password = validation;
  }

  function updateSubmitButton() {
    const allPasswordValid =
      validationState.password.length &&
      validationState.password.number &&
      validationState.password.special;

    const allValid =
      validationState.username && validationState.phone && allPasswordValid;

    submitBtn.disabled = !allValid;
  }

  usernameInput.addEventListener("input", () => {
    const validation = validateUsername(usernameInput.value);
    validationState.username = validation.valid;
    updateGroupState(usernameGroup, usernameInput, validation);
    updateSubmitButton();
  });

  usernameInput.addEventListener("blur", () => {
    const validation = validateUsername(usernameInput.value);
    updateGroupState(usernameGroup, usernameInput, validation);
  });

  phoneInput.addEventListener("input", () => {
    const validation = validatePhone(phoneInput.value);
    validationState.phone = validation.valid;
    updateGroupState(phoneGroup, phoneInput, validation);
    updateSubmitButton();
  });

  phoneInput.addEventListener("blur", () => {
    const validation = validatePhone(phoneInput.value);
    updateGroupState(phoneGroup, phoneInput, validation);
  });

  passwordInput.addEventListener("input", () => {
    const validation = validatePassword(passwordInput.value);
    updatePasswordRequirements(validation);

    const allValid =
      validation.length && validation.number && validation.special;
    passwordGroup.classList.toggle("filled", passwordInput.value.length > 0);
    passwordGroup.classList.toggle("valid", allValid);

    updateSubmitButton();
  });

  passwordToggle.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    passwordToggle.classList.toggle("show", isPassword);
  });

  function resetForm() {
    form.reset();

    [usernameGroup, phoneGroup, passwordGroup].forEach((group) => {
      group.classList.remove("filled", "valid", "error");
    });

    Object.keys(requirements).forEach((key) => {
      requirements[key].classList.remove("valid");
    });

    validationState.username = false;
    validationState.phone = false;
    validationState.password = { length: false, number: false, special: false };

    submitBtn.disabled = true;
    passwordToggle.classList.remove("show");
    passwordInput.type = "password";
  }

  cancelBtn.addEventListener("click", async () => {
    resetForm();

    signupContent.classList.add("transitioning");
    await new Promise((resolve) => setTimeout(resolve, 500));

    signupContent.classList.add("error-transition");
    await new Promise((resolve) => setTimeout(resolve, 150));

    signupContent.classList.remove("transitioning", "error-transition");
    signupContent.classList.add("show-result", "error-result");
    signupResult.classList.add("active", "error");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitBtn.disabled) return;

    const isSuccess = true;

    signupContent.classList.add("transitioning");
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!isSuccess) {
      signupContent.classList.add("error-transition");
      await new Promise((resolve) => setTimeout(resolve, 150));
      signupContent.classList.remove("transitioning", "error-transition");
      signupContent.classList.add("show-result", "error-result");
    } else {
      signupContent.classList.remove("transitioning");
      signupContent.classList.add("show-result");
    }

    signupResult.classList.add("active");
    signupResult.classList.add(isSuccess ? "success" : "error");
  });

  backBtn.addEventListener("click", () => {
    signupResult.classList.remove("active", "success", "error");
    signupContent.classList.remove("show-result", "error-result");
    resetForm();
  });
});

/* ==========================================
   Range Slider
   ========================================== */

document.addEventListener("DOMContentLoaded", function initRangeSlider() {
  const rangeInput = document.getElementById("rangeInput");
  const rangeThumb = document.getElementById("rangeThumb");
  const rangeTrackFill = document.getElementById("rangeTrackFill");
  const rangeValue = document.getElementById("rangeValue");
  const tooltipWrapper = document.querySelector(".range-tooltip-wrapper");
  const tooltipBtn = document.querySelector(".range-tooltip-btn");
  const tooltipClose = document.querySelector(".range-tooltip-close");

  if (!rangeInput || !rangeThumb || !rangeTrackFill || !rangeValue) return;

  const min = parseInt(rangeInput.min);
  const max = parseInt(rangeInput.max);

  function toPersianDigits(num) {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function updateSlider(value) {
    const percentage = ((value - min) / (max - min)) * 100;
    const track = document.querySelector(".range-track");
    const trackRect = track.getBoundingClientRect();
    const sliderWrapper = document.querySelector(".range-slider-wrapper");
    const wrapperRect = sliderWrapper.getBoundingClientRect();

    if (isMobile()) {
      // Mobile: Vertical slider
      // Fill from bottom (min) to current value
      rangeTrackFill.style.width = "100%";
      rangeTrackFill.style.height = `${percentage}%`;

      // Thumb position: bottom = min (10), top = max (100)
      const trackTopInWrapper = trackRect.top - wrapperRect.top;
      const thumbTop =
        trackTopInWrapper + trackRect.height * (1 - percentage / 100) - 6;

      rangeThumb.style.left = "50%";
      rangeThumb.style.top = `${thumbTop}px`;
      rangeThumb.style.transform = "translateX(-50%)";
    } else {
      // Desktop: Horizontal slider (RTL)
      rangeTrackFill.style.width = `${percentage}%`;
      rangeTrackFill.style.height = "";

      // RTL positioning: at min value thumb is at right, at max value thumb is at left
      const trackLeftInWrapper = trackRect.left - wrapperRect.left;
      const thumbLeft =
        trackLeftInWrapper + trackRect.width * (1 - percentage / 100) - 6;

      rangeThumb.style.left = `${thumbLeft}px`;
      rangeThumb.style.top = "";
      rangeThumb.style.transform = "";
    }

    rangeValue.textContent = toPersianDigits(value);
  }

  rangeInput.addEventListener("input", () => {
    updateSlider(parseInt(rangeInput.value));
  });

  let isDragging = false;

  rangeThumb.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const track = document.querySelector(".range-track");
    const trackRect = track.getBoundingClientRect();

    let percentage;

    if (isMobile()) {
      // Mobile: Vertical - top = max, bottom = min
      const mouseY = e.clientY - trackRect.top;
      percentage = (1 - mouseY / trackRect.height) * 100;
    } else {
      // Desktop: Horizontal RTL - left = max, right = min
      const mouseX = e.clientX - trackRect.left;
      percentage = (1 - mouseX / trackRect.width) * 100;
    }

    percentage = Math.max(0, Math.min(100, percentage));
    const value = Math.round(min + (percentage / 100) * (max - min));

    rangeInput.value = value;
    updateSlider(value);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  rangeThumb.addEventListener("touchstart", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const track = document.querySelector(".range-track");
    const trackRect = track.getBoundingClientRect();

    let percentage;

    if (isMobile()) {
      // Mobile: Vertical - top = max, bottom = min
      const touchY = touch.clientY - trackRect.top;
      percentage = (1 - touchY / trackRect.height) * 100;
    } else {
      // Desktop: Horizontal RTL
      const touchX = touch.clientX - trackRect.left;
      percentage = (1 - touchX / trackRect.width) * 100;
    }

    percentage = Math.max(0, Math.min(100, percentage));
    const value = Math.round(min + (percentage / 100) * (max - min));

    rangeInput.value = value;
    updateSlider(value);
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Update on resize to handle orientation changes
  window.addEventListener("resize", () => {
    updateSlider(parseInt(rangeInput.value));
  });

  tooltipBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    tooltipWrapper?.classList.toggle("active");
  });

  tooltipClose?.addEventListener("click", (e) => {
    e.stopPropagation();
    tooltipWrapper?.classList.remove("active");
  });

  document.addEventListener("click", (e) => {
    if (!tooltipWrapper?.contains(e.target)) {
      tooltipWrapper?.classList.remove("active");
    }
  });

  updateSlider(parseInt(rangeInput.value));
});
