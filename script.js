document.body.classList.add("js-enabled");

const weddingDate = new Date("2026-07-18T10:30:00+02:00").getTime();
const rsvpDeadline = new Date("2026-06-15T23:59:59+02:00").getTime();

const countdownEls = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};
const rsvpCountdownEls = {
  days: document.getElementById("rsvp-days"),
  hours: document.getElementById("rsvp-hours"),
  minutes: document.getElementById("rsvp-minutes"),
  seconds: document.getElementById("rsvp-seconds"),
};

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealEls = [...document.querySelectorAll(".reveal")];
const rsvpForm = document.getElementById("rsvp-form");
const rsvpLayout = document.getElementById("rsvp-layout");
const rsvpClosedState = document.getElementById("rsvp-closed-state");
const formResponse = document.getElementById("form-response");
const rsvpSubmitButton = rsvpForm?.querySelector('button[type="submit"]');
const attendanceSelect = rsvpForm?.elements.namedItem("attendance");
const giftPickerField = document.getElementById("gift-picker-field");
const giftPickerToggle = document.getElementById("gift-picker-toggle");
const giftPickerCount = document.getElementById("gift-picker-count");
const giftPicker = document.getElementById("gift-picker");
const otherGiftField = document.getElementById("other-gift-field");
const otherGiftInput = document.getElementById("other-gift-input");
const toastContainer = document.getElementById("toast-container");
const backToTopButton = document.getElementById("back-to-top");
const MAX_GIFTS_PER_RSVP = 3;
const RSVP_REDIRECT_DELAY_MS = 900;
const PENDING_TOAST_KEY = "pendingToast";

const supabaseConfig = window.SUPABASE_CONFIG;
const supabaseClient = window.supabase && supabaseConfig
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

function updateCountdown() {
  if (!countdownEls.days || !countdownEls.hours || !countdownEls.minutes || !countdownEls.seconds) {
    return;
  }

  const now = Date.now();
  const distance = weddingDate - now;

  if (distance <= 0) {
    countdownEls.days.textContent = "000";
    countdownEls.hours.textContent = "00";
    countdownEls.minutes.textContent = "00";
    countdownEls.seconds.textContent = "00";
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  countdownEls.days.textContent = String(Math.floor(distance / day)).padStart(3, "0");
  countdownEls.hours.textContent = String(Math.floor((distance % day) / hour)).padStart(2, "0");
  countdownEls.minutes.textContent = String(Math.floor((distance % hour) / minute)).padStart(2, "0");
  countdownEls.seconds.textContent = String(Math.floor((distance % minute) / 1000)).padStart(2, "0");
}

function isRsvpClosed() {
  return Date.now() > rsvpDeadline;
}

function updateRsvpDeadlineCountdown() {
  if (!rsvpCountdownEls.days || !rsvpCountdownEls.hours || !rsvpCountdownEls.minutes || !rsvpCountdownEls.seconds) {
    return;
  }

  const now = Date.now();
  const distance = rsvpDeadline - now;

  if (distance <= 0) {
    rsvpCountdownEls.days.textContent = "000";
    rsvpCountdownEls.hours.textContent = "00";
    rsvpCountdownEls.minutes.textContent = "00";
    rsvpCountdownEls.seconds.textContent = "00";
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  rsvpCountdownEls.days.textContent = String(Math.floor(distance / day)).padStart(3, "0");
  rsvpCountdownEls.hours.textContent = String(Math.floor((distance % day) / hour)).padStart(2, "0");
  rsvpCountdownEls.minutes.textContent = String(Math.floor((distance % hour) / minute)).padStart(2, "0");
  rsvpCountdownEls.seconds.textContent = String(Math.floor((distance % minute) / 1000)).padStart(2, "0");
}

function setNavState(isOpen) {
  navToggle.setAttribute("aria-expanded", String(isOpen));
  siteNav.classList.toggle("is-open", isOpen);
}

function setFormResponse(message, type = "") {
  void message;
  void type;
  return;
}

function showToast(message, type = "success") {
  if (!toastContainer) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.textContent = message;
  toastContainer.appendChild(toast);

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => {
      toast.remove();
    }, 220);
  }, 5000);
}

function queueToast(message, type = "success") {
  try {
    const queue = JSON.parse(window.sessionStorage.getItem(PENDING_TOAST_KEY) || "[]");
    queue.push({ message, type });
    window.sessionStorage.setItem(PENDING_TOAST_KEY, JSON.stringify(queue));
  } catch {
    // Ignore storage failures and continue.
  }
}

function showPendingToasts() {
  if (!toastContainer) {
    return;
  }

  try {
    const raw = window.sessionStorage.getItem(PENDING_TOAST_KEY);
    if (!raw) {
      return;
    }

    window.sessionStorage.removeItem(PENDING_TOAST_KEY);
    const queue = JSON.parse(raw);
    if (!Array.isArray(queue)) {
      return;
    }

    queue.forEach(({ message, type }) => {
      if (message) {
        showToast(message, type || "success");
      }
    });
  } catch {
    window.sessionStorage.removeItem(PENDING_TOAST_KEY);
  }
}

function setRsvpSubmitting(isSubmitting) {
  if (!rsvpForm || !rsvpSubmitButton) {
    return;
  }

  rsvpForm.classList.toggle("is-submitting", isSubmitting);
  rsvpForm.setAttribute("aria-busy", String(isSubmitting));
  [...rsvpForm.elements].forEach((field) => {
    field.disabled = isSubmitting;
  });
  rsvpSubmitButton.textContent = isSubmitting ? "Sending RSVP..." : "Send RSVP";
}

function applyRsvpDeadlineState() {
  if (!rsvpForm || !rsvpLayout || !rsvpClosedState || !rsvpSubmitButton) {
    return;
  }

  const closed = isRsvpClosed();
  rsvpLayout.classList.toggle("is-closed", closed);
  rsvpClosedState.classList.toggle("hidden", !closed);

  if (!closed) {
    return;
  }

  [...rsvpForm.elements].forEach((field) => {
    field.disabled = true;
  });
  rsvpSubmitButton.textContent = "RSVP Closed";
}

function getThankYouUrl() {
  const isLocalStatic =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return isLocalStatic ? "/thank-you.html" : "/thank-you";
}

function syncBackToTopVisibility() {
  if (!backToTopButton) {
    return;
  }

  const shouldShow = window.scrollY > 240;
  backToTopButton.classList.toggle("is-visible", shouldShow);
}

function syncGiftFieldVisibility() {
  if (!giftPicker || !otherGiftField || !otherGiftInput) {
    return;
  }

  const isDeclining = attendanceSelect?.value === "Regretfully declining";
  const selectedCount = getSelectedGiftIds().length;
  const giftField = giftPickerField?.closest("label");
  const showOtherField = !isDeclining;

  if (giftField) {
    giftField.classList.toggle("hidden", isDeclining);
  }
  otherGiftField.classList.toggle("hidden", !showOtherField);
  otherGiftInput.required = false;

  if (isDeclining) {
    giftPicker.querySelectorAll('input[name="gift_ids"]').forEach((input) => {
      input.checked = false;
    });
    otherGiftInput.value = "";
    setGiftPickerOpen(false);
    syncGiftPickerSummary();
    return;
  }

  giftPicker.querySelectorAll('input[name="gift_ids"]').forEach((input) => {
    const option = input.closest(".gift-option");
    if (input.disabled && option?.classList.contains("is-unavailable")) {
      return;
    }
    const shouldDisable = !input.checked && selectedCount >= MAX_GIFTS_PER_RSVP;
    input.disabled = shouldDisable;
    option?.classList.toggle("is-disabled", shouldDisable);
  });

  syncGiftPickerSummary();
}

function getSelectedGiftIds() {
  if (!giftPicker) {
    return [];
  }

  return [...giftPicker.querySelectorAll('input[name="gift_ids"]:checked')].map((input) => Number(input.value));
}

function setGiftPickerOpen(isOpen) {
  if (!giftPicker || !giftPickerToggle) {
    return;
  }

  giftPicker.classList.toggle("is-collapsed", !isOpen);
  giftPickerToggle.setAttribute("aria-expanded", String(isOpen));
}

function syncGiftPickerSummary() {
  if (!giftPickerCount) {
    return;
  }

  const selectedCount = getSelectedGiftIds().length;
  giftPickerCount.textContent = selectedCount === 1 ? "1 selected" : `${selectedCount} selected`;
}

async function loadGiftOptions() {
  if (!giftPicker) {
    return;
  }

  if (isRsvpClosed()) {
    giftPicker.innerHTML = '<p class="gift-picker-note">RSVP is now closed.</p>';
    return;
  }

  if (!supabaseClient) {
    giftPicker.innerHTML = '<p class="gift-picker-note">Supabase unavailable</p>';
    return;
  }

  const { data, error } = await supabaseClient
    .from("wedding_gifts")
    .select("id, name, quantity_requested, quantity_reserved")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    giftPicker.innerHTML = '<p class="gift-picker-note">Unable to load gifts</p>';
    showToast("Gift list could not be loaded right now.", "error");
    return;
  }

  giftPicker.innerHTML = "";

  data.forEach((gift) => {
    const available = gift.quantity_reserved < gift.quantity_requested;
    const meta = available ? "Available" : "No longer available";
    giftPicker.insertAdjacentHTML(
      "beforeend",
      `<label class="gift-option ${available ? "" : "is-unavailable"}">
        <input type="checkbox" name="gift_ids" value="${gift.id}" ${available ? "" : "disabled"}>
        <span>
          <span class="gift-option-name">${gift.name}</span>
          <span class="gift-option-meta">${meta}</span>
        </span>
      </label>`
    );
  });

  giftPicker.querySelectorAll('input[name="gift_ids"]').forEach((input) => {
    input.addEventListener("change", syncGiftFieldVisibility);
  });

  syncGiftPickerSummary();
  syncGiftFieldVisibility();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

if (attendanceSelect) {
  attendanceSelect.addEventListener("change", syncGiftFieldVisibility);
}

if (giftPickerToggle) {
  giftPickerToggle.addEventListener("click", () => {
    const isOpen = giftPickerToggle.getAttribute("aria-expanded") === "true";
    setGiftPickerOpen(!isOpen);
  });
}

document.addEventListener("click", (event) => {
  if (!giftPickerField || !giftPickerToggle) {
    return;
  }

  if (giftPicker.classList.contains("is-collapsed")) {
    return;
  }

  if (!giftPickerField.contains(event.target)) {
    setGiftPickerOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && giftPicker && !giftPicker.classList.contains("is-collapsed")) {
    setGiftPickerOpen(false);
    giftPickerToggle?.focus();
  }
});

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormResponse("");

    if (isRsvpClosed()) {
      applyRsvpDeadlineState();
      showToast("RSVP closed on 15 June 2026 at 23:59.", "error");
      return;
    }

    const formData = new FormData(rsvpForm);
    const attendance = formData.get("attendance");
    const selectedGiftIds = getSelectedGiftIds();
    const otherGift = formData.get("other_gift")?.toString().trim() ?? "";

    if (attendance === "Joyfully attending" && selectedGiftIds.length === 0 && !otherGift) {
      showToast("Choose up to 3 gifts you will bring, or provide another gift.", "error");
      return;
    }

    if (selectedGiftIds.length > MAX_GIFTS_PER_RSVP) {
      showToast(`Choose no more than ${MAX_GIFTS_PER_RSVP} gifts.`, "error");
      return;
    }

    if (!supabaseClient) {
      showToast("Supabase is not configured. Update supabase-config.js first.", "error");
      return;
    }

    setRsvpSubmitting(true);

    const payload = {
      p_guest_name: formData.get("name"),
      p_guest_email: formData.get("email"),
      p_attendance: attendance,
      p_guest_count: Number(formData.get("guests")),
      p_message: formData.get("message") || null,
      p_gift_ids: selectedGiftIds.length ? selectedGiftIds : null,
      p_other_gift: otherGift || null,
    };

    const { data, error } = await supabaseClient.functions.invoke("rsvp-confirmation", {
      body: payload,
    });

    if (error) {
      showToast("Unable to submit RSVP right now.", "error");
      setRsvpSubmitting(false);
      return;
    }

    if (!data) {
      showToast("Unable to submit RSVP right now.", "error");
      setRsvpSubmitting(false);
      return;
    }

    const successMessage = data.email_sent
      ? "Your RSVP has been received. A confirmation email is on its way."
      : "Your RSVP has been received successfully.";

    if (!data.email_sent) {
      queueToast(
        data.email_error
          ? `Your RSVP was saved, but the confirmation email could not be sent: ${data.email_error}`
          : "Your RSVP was saved, but the confirmation email could not be sent.",
        "error"
      );
    }

    rsvpForm.reset();
    syncGiftFieldVisibility();
    await loadGiftOptions();
    queueToast(successMessage, "success");
    showToast("RSVP received. Redirecting...", "success");
    window.setTimeout(() => {
      window.location.href = getThankYouUrl();
    }, RSVP_REDIRECT_DELAY_MS);
  });
}

updateCountdown();
if (countdownEls.days) {
  setInterval(updateCountdown, 1000);
}
applyRsvpDeadlineState();
updateRsvpDeadlineCountdown();
if (rsvpCountdownEls.days) {
  setInterval(() => {
    updateRsvpDeadlineCountdown();
    if (isRsvpClosed()) {
      applyRsvpDeadlineState();
    }
  }, 1000);
}
syncGiftFieldVisibility();
loadGiftOptions();
showPendingToasts();
syncBackToTopVisibility();
window.addEventListener("scroll", syncBackToTopVisibility, { passive: true });
