const $ = id => document.getElementById(id);
const output = $("output");

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
  fields.map(({ emailOrUsername, password, service }) => {
    output.innerHTML += `<div class>
    <p>${service}</p>
    <p>${emailOrUsername}</p>
    <p class="output_field_password">${password}</p>
    </div>`;
    // Use the master for decrypting password fields
    function revealPassword(e) {
      e.target.innerHTML = CryptoJS.AES.decrypt(
        e.target.innerHTML,
        master
      ).toString(CryptoJS.enc.Utf8);
    }
    // Attach listeners on password fields
    Array.from(
      document.getElementsByClassName("output_field_password")
    ).map(e => e.addEventListener("click", revealPassword));
  });
}

const getVault = ({ exists }) => {
  // FIXME: Show a modal for creating a vault.
  if (!exists) {
    console.error("You don't have a vault.");
    return;
  }
  fetch("/vault/open", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken("auth")}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      password: "test1234"
    })
  })
    .then(async res => showFields(await res.json()))
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
  fetch("/vault/check", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken("auth")}`
    }
  })
    .then(res => res.json())
    .then(getVault)
    .catch(err => console.error(err));
})();
