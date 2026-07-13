async function loadComponent(elementId, filePath) {
  const element = document.getElementById(elementId);

  if (!element) return;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Could not load ${filePath}`);
    }

    element.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const button = document.querySelector(".theme-toggle");

  if (html.dataset.theme === "light") {
    html.dataset.theme = "dark";

    if (button) {
      button.innerHTML = "☾ Dark";
    }
  } else {
    html.dataset.theme = "light";

    if (button) {
      button.innerHTML = "☀ Light";
    }
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById("navActions");
  const button = document.querySelector(".menu-toggle");
  const backdrop = document.getElementById("mobileMenuBackdrop");

  if (!menu || !button || !backdrop) return;

  const isOpen = menu.classList.toggle("open");

  button.classList.toggle("active", isOpen);
  backdrop.classList.toggle("show", isOpen);

  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
}

function closeMobileMenu() {
  const menu = document.getElementById("navActions");
  const button = document.querySelector(".menu-toggle");
  const backdrop = document.getElementById("mobileMenuBackdrop");

  if (!menu || !button || !backdrop) return;

  menu.classList.remove("open");
  button.classList.remove("active");
  backdrop.classList.remove("show");

  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Open navigation menu");
}

document.addEventListener("click", event => {
  const navigationLink = event.target.closest(".nav-actions a");

  if (
    navigationLink &&
    window.matchMedia("(max-width: 780px)").matches
  ) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", event => {
  const menu = document.getElementById("navActions");

  if (
    event.key === "Escape" &&
    menu?.classList.contains("open")
  ) {
    closeMobileMenu();
    document.querySelector(".menu-toggle")?.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 780) {
    closeMobileMenu();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("navbar-container", "/components/navbar.html");
  await loadComponent("footer-container", "/components/footer.html");
});
