const $ = id => document.getElementById(id).value || "";

const showErrors = errObj => {
  // Clear function
  const clear = () => $("error_handler").remove();
  // If the error handler is up, remove it first
  if ($("error_handler")) clear();
  // Generate error handler
  const payload = `
  <div id="error_handler">
    <i class="fas fa-times error_handler_x"></i>
    <div class="error_handler_output">
      ${Object.keys(errMessages).map(
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

const register = async () => {
  const data = {
    firstName: $("first_name_input"),
    lastName: $("last_name_input"),
    email: $("email_input"),
    password: $("password_input"),
    confirmPassword: $("confirm_password_input")
  };
  const res = await fetch("/register", { method: "POST" }, data);
  const payload = await res.json();
  if (res.status !== 200) showErrors(payload);
  console.log(`Registered`);
};

document.getElementById("submit_button").addEventListener("click", register);
