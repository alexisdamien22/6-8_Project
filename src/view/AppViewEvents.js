import { AppViewTheme } from "./AppViewTheme.js";

export function initAppEvents(view) {
  document.addEventListener("change", (e) => {
    if (e.target.id === "theme-checkbox") AppViewTheme.toggle(e.target.checked);
  });

  document.addEventListener("click", (e) => {
    const bottomMenu = document.getElementById("bottom-menu-container");
    if (bottomMenu?.classList.contains("show")) {
      const clickedIcon = e.target.closest(".icon-footer");
      const icons = Array.from(document.querySelectorAll(".icon-footer"));
      const isMenuIcon = clickedIcon && icons.indexOf(clickedIcon) === 3;
      if (!e.target.closest(".bottom-menu-sheet") && !isMenuIcon)
        view.toggleBottomMenu(false);
    }

    const paramBtn = e.target.closest(".parametre");
    if (paramBtn) {
      let rot = parseInt(paramBtn.dataset.rotation || "0", 10) + 360;
      paramBtn.dataset.rotation = rot;
      paramBtn.style.transform = `rotate(${rot}deg)`;
      window.appController?.navigateToPage("settings");
      view.syncFooter(3);
    }
  });

  view.app.addEventListener("click", (e) => {
    const startBtn = e.target.closest(".start-btn");
    if (startBtn && !startBtn.disabled) {
      window.appController?.model.completeCurrentSession();
      window.appController?.navigateToPage("home");
      return;
    }

    if (e.target.closest(".duo-popup")) {
      e.stopImmediatePropagation();
      return;
    }

    const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    const pathDot = clickedElement?.closest(".path-dot");

    if (pathDot) {
      const step = pathDot.closest(".path-step");
      const popup = step.querySelector(".duo-popup");
      document
        .querySelectorAll(".path-step")
        .forEach((s) => (s.style.zIndex = "1"));
      document
        .querySelectorAll(".duo-popup")
        .forEach((p) => p !== popup && p.classList.remove("show"));
      popup.classList.toggle("show");
      step.style.zIndex = popup.classList.contains("show") ? "999" : "1";
    } else {
      document.querySelectorAll(".duo-popup.show").forEach((p) => {
        p.classList.remove("show");
        p.closest(".path-step").style.zIndex = "1";
      });
    }
  });

  view.app.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest(".path-button-container");
    if (btn && !e.target.closest(".duo-popup")) {
      btn.classList.add("pressed");
      try {
        btn.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  });

  const release = (e) => {
    document
      .querySelectorAll(".path-button-container.pressed")
      .forEach((btn) => {
        btn.classList.remove("pressed");
        if (e?.pointerId)
          try {
            btn.releasePointerCapture(e.pointerId);
          } catch (err) {}
      });
  };
  view.app.addEventListener("pointerup", release);
  view.app.addEventListener("pointercancel", release);
  view.app.addEventListener("pointerleave", release);
}
