const $ = id => document.getElementById(id).value || "";
const submitButton = document.getElementById("submit_button");

const showErrors = errObj => {
  // Clear function
  const clear = () => {
    const output = document.getElementById("error_handler");
    output.remove();
  };
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
`;
  document.body.innerHTML += payload;
  // Remove element after animation is done.
  // The animation lasts for 5 seconds, hence the 5000ms timeout.
  setTimeout(clear, 5000);
};

const register = () => {
  const data = {
    firstName: $("first_name_input"),
    lastName: $("last_name_input"),
    email: $("email_input"),
    password: $("password_input"),
    confirmPassword: $("confirm_password_input")
  };
  axios
    .post("/register", data)
    .then(() => (window.location.href = "/login"))
    .catch(err => showErrors(err.response.data));
};

submitButton.addEventListener("click", register);
