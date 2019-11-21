const $ = id => document.getElementById(id);
const input = $("password_input");
const output = $("output");
const drawer = $("drawer");
const wrapper = $("error_handler_wrapper");
const modal = $("modal");
const settings = $("settings");
const settingsOpenBtn = $("open_settings");
const settingsCloseBtn = $("settings_close_btn");
const modalSubmitBtn = $("modal_submit_btn");
const modalCloseBtn = $("modal_close_btn");
const navMenuBtn = $("dashboard_nav_menu_button");
const deleteVaultBtn = $("settings_delete_vault");
const deleteAccountBtn = $("settings_delete_account");
const logoutBtn = $("logout");

function callAPI(url, method, payload, onResolve) {
  const Authorization = `Bearer ${handleCookie("auth", "get")}`;
  const config = {
    headers: {
      Authorization,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  if (payload) config.body = JSON.stringify(payload);
  fetch(url, {
    method,
    ...config
  })
    .then(onResolve)
    .catch(err => showErrors(err.response.data));
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].includes(name)) return cookies[i].replace(name, "");
  }
  return false;
}

function deleteCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].includes(name)) document.cookie = `${name}; Max-Age=0`;
  }
}

function handleCookie(cookie, method) {
  const name = `${cookie}=`;
  if (method === "get") return getCookie(name);
  return deleteCookie(name);
}

function render(service, emailOrUsername, password) {
  output.innerHTML += `<div class="output_field">
    <div class="output_field_wrapper">
    <p class="output_field_text">${service}</p>
    <p class="output_field_text">${emailOrUsername}</p>
    </div>
    <div class="output_field_wrapper">
    <input type="password" class="output_field_password" value="${password}" placeholder="Click to reveal the password!" readonly />
    </div>
    </div>`;
}

function showFields({ fields, masterPassword: master }) {
  // Hide input
  $("password").style.display = "none";
  // Clear output
  output.innerHTML = "";
  // Conduct rendering
  if (fields.length > 0) {
    fields.map(({ emailOrUsername, password, service }) => {
      render(service, emailOrUsername, password);
      // Use the master for decrypting password fields
      function revealPassword(e) {
        if (e.target.type !== "text") {
          e.target.type = "text";
          e.target.value = CryptoJS.AES.decrypt(
            e.target.value,
            master
          ).toString(CryptoJS.enc.Utf8);
        }
      }
      // Attach listeners on password fields
      Array.from(document.getElementsByClassName("output_field_password")).map(
        e => (e.onclick = revealPassword)
      );
    });
  } else {
    output.innerHTML += `<div class="output_field">
    <div class="output_field_wrapper">
    <p class="output_field_text">No passwords in vault.</p>
    </div>`;
  }
  // Show add field button
  const addField = $("add_field");
  addField.style.display = "flex";
  addField.onclick = openModal;
}

function openDrawer() {
  drawer.classList.toggle("open");
  navMenuBtn.toggleAttribute("data-isopen");
}

function openModal() {
  modal.classList.add("open_modal");
  modalCloseBtn.onclick = () => modal.classList.remove("open_modal");
  // Set submit event
  modalSubmitBtn.onclick = addNewField;
}

function openSettings() {
  settings.classList.add("open_settings");
  settingsCloseBtn.onclick = () => settings.classList.remove("open_settings");
}

function addNewField() {
  const data = {
    emailOrUsername: $("modal_input_emailOrUsername").value,
    service: $("modal_input_service").value,
    password: $("modal_input_password").value
  };
  callAPI("/vault/add", "PUT", data, async res => {
    // Close modal
    modal.classList.remove("open_modal");
    showFields(await res.json());
  });
}

function showErrors(errObj) {
  // Disable input
  input.readOnly = true;
  // Clear function
  const clear = () => {
    wrapper.innerHTML = "";
    input.readOnly = false;
  };
  // Generate error handler
  const payload = `
  <div id="error_handler">
    <i class="fas fa-times error_handler_x"></i>
    <div class="error_handler_output">
    <p class="error_handler_output_line">${errObj}</p>
    </div>
  </div>
`
    .split(",")
    .join("");

  wrapper.innerHTML += payload;
  // Remove element after animation is done.
  // The animation lasts for 5 seconds, hence the 5000ms timeout.
  setTimeout(clear, 5000);
}

function handleVaultCheck({ exists }) {
  const label = $("password_label");
  label.innerHTML = exists ? "Open your vault!" : "Create your vault!";
  input.onkeydown = e => {
    if (e.keyCode === 13)
      exists ? openVault(e.target.value) : createVault(e.target.value);
  };
}

function openVault(password) {
  callAPI("/vault/open", "POST", { password }, async res => {
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    showFields(data);
  });
}

function createVault(password) {
  callAPI("/vault/create", "POST", { password }, async res => {
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    checkForVault();
  });
}

function checkForVault() {
  callAPI("/vault/check", "GET", null, async res =>
    handleVaultCheck(await res.json())
  );
}

function logout() {
  handleCookie("auth", "delete");
  window.location.href = "/login";
}

function deleteVault() {
  callAPI("/vault/delete", "DELETE", null, () => {
    checkForVault();
    settings.classList.remove("open_settings");
  });
}

function deleteAccount() {
  callAPI("/delete", "DELETE", null, () => (window.location.href = "/"));
}

function setListeners() {
  // Drawer button listener
  navMenuBtn.onclick = openDrawer;
  // Settings panel listener
  settingsOpenBtn.onclick = openSettings;
  // Logout listener
  logoutBtn.onclick = logout;
  // Global listener for closing the drawer
  window.onclick = e => {
    const classes = Array.from(e.target.classList);
    if (
      e.target !== drawer &&
      e.target !== navMenuBtn &&
      !classes.filter(s => s.includes("drawer_opt")).length > 0
    ) {
      drawer.classList.remove("open");
      navMenuBtn.removeAttribute("data-isopen");
    }
  };
  // Delete vault
  deleteVaultBtn.onclick = deleteVault();
  // Delete account
  deleteAccountBtn.onclick = deleteAccount();
}

(() => {
  // Set background color to avoid white overlap
  document.body.style.backgroundColor = "#4e82ca";
  // Initialize listeners
  setListeners();
  // Start the vault procedure
  checkForVault();
})();
