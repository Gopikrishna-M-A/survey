// Navbar Shadow
let navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 0) {
    navbar.classList.add("navShadow");
  } else {
    navbar.classList.remove("navShadow");
  }
});