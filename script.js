const content = document.getElementById("content");
const nav = document.getElementById("nav");
const close_btn = document.getElementById("close-btn");
const toggle_btn = document.getElementById("toggle-btn");

toggle_btn.addEventListener("click", openNav);
close_btn.addEventListener("click", closeNav);

function openNav() {
  this.style.display = "none";
  nav.classList.add("active");
  content.classList.add("active");
}

function closeNav() {
  toggle_btn.style.display = "block";
  nav.classList.remove("active");
  content.classList.remove("active");
}