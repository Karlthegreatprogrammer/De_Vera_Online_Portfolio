const routes = Array.from(document.querySelectorAll("[data-route]"));
const pages = Array.from(document.querySelectorAll(".page[data-page]"));
const navButtons = Array.from(document.querySelectorAll(".main-nav [data-route]"));
const revealSelector = [
  ".page-intro",
  ".glass-card",
  ".mini-card",
  ".metric-card",
  ".timeline-card",
  ".edu-card",
  ".note-card",
  ".cap-card",
  ".credential-card",
  ".contact-list div",
  ".contact-values div"
].join(",");

function setPage(pageName, replace = false) {
  const target = pages.find((page) => page.dataset.page === pageName) ? pageName : "home";
  const targetPage = pages.find((page) => page.dataset.page === target);

  document.body.dataset.page = target;
  pages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === target);
    page.classList.remove("is-revealing");
  });
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.route === target));
  const activeNav = navButtons.find((button) => button.dataset.route === target);

  if (activeNav && window.matchMedia("(max-width: 840px)").matches) {
    activeNav.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && targetPage) {
    targetPage.querySelectorAll(revealSelector).forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index, 9) * 38}ms`);
    });
    requestAnimationFrame(() => targetPage.classList.add("is-revealing"));
  }

  const url = `#${target}`;
  if (replace) {
    history.replaceState(null, "", url);
  } else if (location.hash !== url) {
    history.pushState(null, "", url);
  }

  const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  resetScroll();
  requestAnimationFrame(resetScroll);
  setTimeout(resetScroll, 40);
}

routes.forEach((item) => {
  item.addEventListener("click", (event) => {
    const pageName = item.dataset.route;
    if (!pageName) return;
    event.preventDefault();
    setPage(pageName);
  });
});

window.addEventListener("hashchange", () => {
  setPage(location.hash.replace("#", "") || "home", true);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const original = button.innerHTML;

    try {
      await navigator.clipboard.writeText(value);
      button.innerHTML = '<i data-lucide="check"></i>';
      window.lucide?.createIcons();
      setTimeout(() => {
        button.innerHTML = original;
        window.lucide?.createIcons();
      }, 1100);
    } catch {
      button.setAttribute("title", value);
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js-ready");
  setPage(location.hash.replace("#", "") || "home", true);
  window.lucide?.createIcons();
});
