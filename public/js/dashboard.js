const $ = id => document.getElementById(id);
const input = $("password_input");
const output = $("output");
const wrapper = $("error_handler_wrapper");
const submitBtn = $("modal_submit_btn");
const modal = $("modal");
const closeBtn = $("modal_close_btn");

function getCookie(cookie) {
  const cookies = document.cookie.split(";");
  const name = `${cookie}=`;
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].includes(name)) return cookies[i].replace(name, "");
  }
  return false;
}

function deleteCookie(cookie) {
  const cookies = document.cookie.split(";");
  const name = `${cookie}=`;
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].includes(name)) document.cookie = `${name}; Max-Age=0`;
  }
}

function showFields({ fields, masterPassword: master }) {
  // Hide input
  input.style.display = "none";
  // Clear output
  output.innerHTML = "";
  fields.map(({ emailOrUsername, password, service }) => {
    output.innerHTML += `<div class="output_field">
    <div class="output_field_wrapper">
    <p class="output_field_text">${service}</p>
    <p class="output_field_text">${emailOrUsername}</p>
    </div>
    <div class="output_field_wrapper">
    <input type="password" class="output_field_password" value="${password}" readonly />
    </div>
    </div>`;
    // Use the master for decrypting password fields
    function revealPassword(e) {
      if (e.target.type !== "text") {
        e.target.type = "text";
        e.target.value = CryptoJS.AES.decrypt(e.target.value, master).toString(
          CryptoJS.enc.Utf8
        );
      }
    }
    // Attach listeners on password fields
    Array.from(
      document.getElementsByClassName("output_field_password")
    ).map(e => e.addEventListener("click", revealPassword));
  });
  // Show add field button
  const addField = $("add_field");
  addField.style.display = "flex";
  addField.onclick = openModal;
}

const openModal = () => {
  modal.classList.add("open_modal");
  closeBtn.onclick = () => modal.classList.remove("open_modal");
  // Set submit event
  submitBtn.onclick = addNewField;
};

const addNewField = () => {
  const data = {
    emailOrUsername: $("modal_input_emailOrUsername").value,
    service: $("modal_input_service").value,
    password: $("modal_input_password").value
  };
  fetch("/vault/add", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("auth")}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(async res => {
      // Close modal
      modal.classList.remove("open_modal");
      showFields(await res.json());
    })
    .catch(err => showErrors(err.response.data));
};

const showErrors = errObj => {
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
};

const handleVaultCheck = ({ exists }) => {
  // Attach listener to master password input box.
  if (exists) {
    input.setAttribute("placeholder", "Master Password:");
    input.onkeydown = e => {
      if (e.keyCode === 13) openVault(e.target.value);
    };
  } else {
    input.setAttribute("placeholder", "Create your vault:");
    input.onkeydown = e => {
      if (e.keyCode === 13) createVault(e.target.value);
    };
  }
};

const openVault = password => {
  fetch("/vault/open", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("auth")}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      password
    })
  })
    .then(async res => {
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showFields(data);
    })
    .catch(err => showErrors(err));
};

const createVault = password => {
  fetch("/vault/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("auth")}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      password
    })
  })
    .then(async res => {
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      checkForVault();
    })
    .catch(err => showErrors(err));
};

const checkForVault = () => {
  fetch("/vault/check", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("auth")}`
    }
  })
    .then(async res => handleVaultCheck(await res.json()))
    .catch(err => console.error(err));
};

(() => {
  const btn = $("dashboard_nav_menu_button");
  const drawer = $("drawer");
  // Button listener
  btn.onclick = () => {
    drawer.classList.toggle("open");
    btn.toggleAttribute("data-isopen");
  };
  // Global listener for closing the drawer
  window.onclick = e => {
    const classes = Array.from(e.target.classList);
    if (
      e.target !== drawer &&
      e.target !== btn &&
      !classes.filter(s => s.includes("drawer_opt")).length > 0
    ) {
      drawer.classList.remove("open");
      btn.removeAttribute("data-isopen");
    }
  };
  // Set background color to #1B2A78 (dashboard background) to avoid white overlap
  document.body.style.backgroundColor = "#4e82ca";
  // Get vault
  checkForVault();
})();

// Logout
$("logout").onclick = () => {
  deleteCookie("auth");
  window.location.href = "/";
};
