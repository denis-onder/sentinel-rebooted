const $ = id => document.getElementById(id).value || "";
const submitButton = document.getElementById("submit_button");
const wrapper = document.getElementById("error_handler_wrapper");

const showErrors = errObj => {
  // Clear function
  const clear = () => {
    wrapper.innerHTML = "";
    submitButton.disabled = "";
  };
  // Disable registration button
  submitButton.disabled = "disabled";
  // Generate error handler
  const payload = `
  <div id="error_handler">
    <i class="fas fa-times error_handler_x"></i>
    <div class="error_handler_output">
      ${Object.keys(errObj).map(
        k => `<p class="error_handler_output_line">${errObj[k]}</p>`
      )}
    </div>
  </div>
`
    .split(",")
    .join("");

  wrapper.innerHTML += payload;
  // Remove element after animation is done.
  // The animation lasts for 5 seconds, hence the 5000ms timeout.
  setTimeout(clear, 5000);
};

const auth = e => {
  const path = window.location.pathname;
  if (path !== "/register" && path !== "/login") return false;
  e.preventDefault();
  const data = {
    email: $("email_input"),
    password: $("password_input")
  };
  if (path === "/register") {
    (data.firstName = $("first_name_input")),
      (data.lastName = $("last_name_input")),
      (data.confirmPassword = $("confirm_password_input"));
  }
  axios
    .post(path, data)
    .then(() => {
      if (path === "/register") return (window.location.href = "/login");
      return (window.location.href = "/dashboard");
    })
    .catch(err => showErrors(err.response.data));
};

(() => submitButton.addEventListener("click", auth))();
