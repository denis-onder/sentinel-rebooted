const elements = document.querySelectorAll(".landing_box_link_text");

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
