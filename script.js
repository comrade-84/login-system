const form = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector(".password-toggle");
const rememberInput = document.querySelector("#remember");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const formMessage = document.querySelector("#form-message");
const submitStatus = document.querySelector("#submit-status");
const strengthLabel = document.querySelector("#strength-label");
const strengthBars = [...document.querySelectorAll(".strength-bars span")];

const savedEmail = localStorage.getItem("rememberedEmail");
if (savedEmail) {
  emailInput.value = savedEmail;
  rememberInput.checked = true;
}

passwordToggle.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  passwordToggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  passwordToggle.setAttribute("aria-pressed", String(isHidden));
});

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

passwordInput.addEventListener("input", () => {
  const score = passwordStrength(passwordInput.value);
  const names = ["", "weak", "fair", "good", "strong"];
  const labels = ["Password strength", "Weak", "Fair", "Good", "Strong"];
  strengthLabel.textContent = labels[score];

  strengthBars.forEach((bar, index) => {
    bar.className = index < score ? `active ${names[score]}` : "";
  });
});

function validateEmail() {
  const email = emailInput.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  emailInput.classList.toggle("invalid", !valid);
  emailError.textContent = valid ? "" : "Enter a valid email address.";
  return valid;
}

function validatePassword() {
  const password = passwordInput.value;
  let message = "";
  if (password.length < 8) message = "Password must be at least 8 characters.";
  else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) message = "Include both uppercase and lowercase letters.";
  else if (!/\d/.test(password)) message = "Include at least one number.";

  passwordInput.classList.toggle("invalid", Boolean(message));
  passwordError.textContent = message;
  return !message;
}

emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailValid = validateEmail();
  const passwordValid = validatePassword();
  formMessage.className = "form-message";

  if (!emailValid || !passwordValid) {
    formMessage.textContent = "Please correct the highlighted fields.";
    formMessage.classList.add("error");
    submitStatus.textContent = "Not submitted";
    return;
  }

  if (rememberInput.checked) localStorage.setItem("rememberedEmail", emailInput.value.trim());
  else localStorage.removeItem("rememberedEmail");

  formMessage.textContent = "Login information validated successfully.";
  submitStatus.textContent = "Submitted";
  form.reset();
  rememberInput.checked = Boolean(localStorage.getItem("rememberedEmail"));
  strengthBars.forEach((bar) => { bar.className = ""; });
  strengthLabel.textContent = "Password strength";
});

document.querySelector("#forgot-password").addEventListener("click", (event) => {
  event.preventDefault();
  formMessage.className = "form-message";
  formMessage.textContent = "Password recovery would be available through your account provider.";
});
