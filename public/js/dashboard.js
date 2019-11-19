const $ = id => document.getElementById(id);
const input = $("password_input");
const output = $("output");
const wrapper = $("error_handler_wrapper");

function getToken(cookie) {
  const cookies = document.cookie.split(";");
  const name = `${cookie}=`;
  for (let i = 0; i < cookies.length; i++) {
    let temp = cookies[i].trim();
    if (temp.indexOf(name) == 0)
      return temp.substring(name.length, temp.length);
  }
  return false;
}

function showFields({ fields, masterPassword: master }) {
  // Remove master password input
  $("password").innerHTML = "";
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
  $("add_field").style.display = "flex";
}

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

const getVault = ({ exists }) => {
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
      Authorization: `Bearer ${getToken("auth")}`,
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
      Authorization: `Bearer ${getToken("auth")}`,
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
  // Clear input box
  fetch("/vault/check", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken("auth")}`
    }
  })
    .then(res => res.json())
    .then(getVault)
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
  // Get vault
  checkForVault();
})();
