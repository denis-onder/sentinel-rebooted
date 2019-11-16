const $ = id => document.getElementById(id);
const output = $("output");

function getToken() {
  const cookies = document.cookie.split(";");
  const name = "auth=";
  for (let i = 0; i < cookies.length; i++) {
    let temp = cookies[i].trim();
    if (temp.indexOf(name) == 0)
      return `Bearer ${temp.substring(name.length, temp.length)}`;
  }
  return false;
}

function showFields(vault) {
  vault.map(({ emailOrUsername, password, service }) => {
    output.innerHTML += `<div class><p>${emailOrUsername}</p></div>`;
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
      Authorization: getToken(),
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
      Authorization: getToken()
    }
  })
    .then(res => res.json())
    .then(getVault)
    .catch(err => console.error(err));
})();
