import { ToastState } from "./enums/toast-state";
import { $ } from "../utils/domUtils";

document.addEventListener("DOMContentLoaded", function () {
  const form = $(".contact__form");
  form.addEventListener("submit", submitContactForm);
});

async function submitContactForm(event) {
  event.preventDefault();
  const formData = getFormData(event.target);

  disabledSubmitButton(true);
  try {
    const response = await sendContactFormData(formData);

    if (response.ok) {
      createToast(ToastState.SUCCESS);
    } else {
      throw new Error("Failed to submit form");
    }
  } catch (error) {
    console.error(error);
    disabledSubmitButton(false);
    createToast(ToastState.ERROR);
  } finally {
    disabledSubmitButton(false);
  }

}

// name=wqdwqd&email=dwqdq@qwd.com&phone=986321852&message=qwdqwdqw

async function sendContactFormData(formData) {
  const googleScriptURL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  console.log(formData);
  
  return await fetch(googleScriptURL, {
    redirect: "follow",
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: formData,
  });
}

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

//name	email	phone	message

/**
 * this function allows to enable or disable the submit button
 * @param {boolean} isDisabled
 */
function disabledSubmitButton(isDisabled) {
  const submitBtn = $(".contact__form button[type='submit']");

  if (isDisabled) {
    submitBtn.disabled = true;
    submitBtn.classList.add("button-disabled");
    submitBtn.classList.remove("button-enabled");
  } else {
    submitBtn.disabled = false;
    submitBtn.classList.remove("button-disabled");
    submitBtn.classList.add("button-enabled");
  }
}

function getFormData() {
  const form = $(".contact__form");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.name = `${data["first-name"]} ${data["last-name"]}`;
  delete data["first-name"];
  delete data["last-name"];

  const orderedData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  };

  return new URLSearchParams(orderedData).toString();
}

/**
 * this was created to simulate a request to the server
 * @param {number} time
 * @param {boolean} hasFailed
 * @returns {Promise}
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
