import { ToastState } from "./enums/toast-state";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact__form");

  document.querySelector('input[name="first-name"]').value = "John";
  document.querySelector('input[name="last-name"]').value = "Doe";
  document.querySelector('input[name="phone"]').value = "123456789";
  document.querySelector('input[name="email"]').value = "john.doe@example.com";
  document.querySelector('textarea[name="message"]').value =
    "Hello, I have a question about your services.";

  form.addEventListener("submit", submitForm);
});

function createToast(type = "error", duration = 3000) {
  const toastContainer = document.getElementById("toast");
  const delay = (duration / 1000).toFixed(2);

  const toast = document.createElement("div");
  toast.classList.add("toast", `toast--${type}`);
  toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

  if (type === ToastState.SUCCESS) {
    toast.innerHTML = `
      <figure class="toast__icon">
        <img src="./src/assets/icons/check-icon.svg" alt="Check" />
      </figure>
      <div class="toast__content">
        <h4>Form sent successfully!</h4>
        <span>Your information has been sent successfully.</span>
      </div>
    `;
  } else if (type === ToastState.ERROR) {
    toast.innerHTML = `
      <figure class="toast__icon">
        <img src="./src/assets/icons/warning-icon.svg" alt="Warning" />
      </figure>
      <div class="toast__content">
        <h4>Error sending form!</h4>
        <span>There was an error sending your information.</span>
      </div>
    `;
  }

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, duration);
}

async function submitForm(event) {
  event.preventDefault();
  const formData = getFormData();

  disabledSubmitButton(true);

  try {
    const response = await simulateRequest(2000, false);
    //console.log(response);
    createToast(ToastState.SUCCESS);
  } catch (error) {
    console.error(error);
    disabledSubmitButton(false);
    createToast(ToastState.ERROR);
  } finally {
    disabledSubmitButton(false);
  }

  console.log("Form data: ", formData);
}

/**
 * 
 * @param {boolean} isDisabled 
 */
function disabledSubmitButton(isDisabled) {
  const submitBtn = document.querySelector(".contact__form button[type='submit']");
  
  if (isDisabled) {
    submitBtn.disabled = true;
    submitBtn.classList.add('button-disabled');
    submitBtn.classList.remove('button-enabled');
  } else {
    submitBtn.disabled = false;
    submitBtn.classList.remove('button-disabled');
    submitBtn.classList.add('button-enabled');
  }
}


function getFormData() {
  const form = document.querySelector(".contact__form");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  return data;
}

/**
 * @param {number} time
 * @returns {Promise}
 * @param {boolean} hasFailed
 */
function simulateRequest(time, hasFailed = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      hasFailed
        ? reject("Failed to submit form")
        : resolve("Form submitted successfully");
    }, time);
  });
}
