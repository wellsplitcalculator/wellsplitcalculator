// Theme management
function getPreferredTheme() {
  // Check localStorage first
  const savedTheme = localStorage.getItem('wellsplit-theme');
  if (savedTheme) {
    return savedTheme;
  }
  // If no saved preference, check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  // Default to light
  return 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('wellsplit-theme', theme);
  
  // Update toggle button if it exists
  const button = document.querySelector(".theme-toggle");
  if (button) {
    button.innerHTML = theme === "dark" ? "☾ Dark" : "☀ Light";
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.dataset.theme || 'light';
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

async function loadComponent(elementId, filePath) {
  const element = document.getElementById(elementId);

  if (!element) return;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Could not load ${filePath}`);
    }

    element.innerHTML = await response.text();
    
    // Apply theme after navbar loads (in case the toggle button is in the navbar)
    if (elementId === "navbar-container") {
      // Force a reflow to ensure the navbar height is calculated correctly
      const nav = document.querySelector('nav');
      if (nav) {
        const navHeight = nav.offsetHeight;
        document.body.style.paddingTop = navHeight + 'px';
      }
      
      // Update theme toggle button if it exists in the navbar
      const savedTheme = getPreferredTheme();
      const button = document.querySelector(".theme-toggle");
      if (button) {
        button.innerHTML = savedTheme === "dark" ? "☾ Dark" : "☀ Light";
      }
    }
  } catch (error) {
    console.error(error);
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

// Listen for theme changes from other tabs/windows
window.addEventListener('storage', function(event) {
  if (event.key === 'wellsplit-theme') {
    const newTheme = event.newValue;
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', newTheme);
      const button = document.querySelector(".theme-toggle");
      if (button) {
        button.innerHTML = newTheme === "dark" ? "☾ Dark" : "☀ Light";
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  // Apply saved theme BEFORE loading components to prevent flicker
  const savedTheme = getPreferredTheme();
  setTheme(savedTheme);
  
  await loadComponent("navbar-container", "/components/navbar.html");
  await loadComponent("footer-container", "/components/footer.html");
  
  // Ensure theme is still applied after components load
  const currentTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);
  const button = document.querySelector(".theme-toggle");
  if (button) {
    button.innerHTML = currentTheme === "dark" ? "☾ Dark" : "☀ Light";
  }
});
