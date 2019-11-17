const elements = document.querySelectorAll(".landing_box_link_text");

// If there's a auth cookie, redirect to the dashboard page.
window.onload = () => {
  if (document.cookie.includes("auth=")) window.location.href = "/dashboard";
};

// Hover event
elements.forEach(elem => {
  // Add class
  elem.addEventListener("mouseover", e => {
    const target = document.getElementById(`${e.target.id}_arrow`);
    target.classList.add("hovering");
  });
  // Remove class
  elem.addEventListener("mouseout", e => {
    const target = document.getElementById(`${e.target.id}_arrow`);
    target.classList.remove("hovering");
  });
});
