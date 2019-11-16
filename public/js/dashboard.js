(() => {
  const btn = document.getElementById("dashboard_nav_menu_button");
  const drawer = document.getElementById("drawer");
  // Button listener
  btn.onclick = () => {
    drawer.classList.toggle("open");
    btn.toggleAttribute("data-isopen");
  };
})();
