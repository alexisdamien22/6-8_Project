import { esc } from "../utils/FormHelpers.js";

export const AccountSwitcher = {
  create(view, accounts = []) {
    if (document.getElementById("account-switcher-container")) return;

    const accountsHTML = accounts
      .map(
        (acc) => `
      <div class="switcher-item" data-id="${acc.id}">
        <div class="switcher-avatar">${acc.mascotte || "🎵"}</div>
        <div class="switcher-info">
          <span class="switcher-name">${esc(acc.name)}</span>
          <span class="switcher-status">Élève</span>
        </div>
      </div>
    `,
      )
      .join("");

    const switcherHTML = `
      <div id="account-switcher-container" class="account-switcher-container">
        <div class="account-switcher-overlay"></div>
        <div class="account-switcher-sheet">
          <div class="switcher-header">Changer de profil</div>
          <div class="switcher-list">
            ${accountsHTML}
            <div class="switcher-item" id="btn-switch-add">
            <div class="switcher-avatar">+</div>
            <div class="switcher-info">
              <span class="switcher-name">Ajouter un enfant</span>
            </div>
          </div>
          </div>
          <div class="switcher-divider"></div>
          
          <div class="switcher-item" id="btn-switch-parent">
            <div class="switcher-info">
              <span class="switcher-name">Espace Parent</span>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", switcherHTML);
    this.attachEventListeners(view);
  },

  attachEventListeners(view) {
    const container = document.getElementById("account-switcher-container");
    if (!container) return;

    container
      .querySelector(".account-switcher-overlay")
      .addEventListener("click", () => {
        view.toggleAccountSwitcher(false);
      });

    container.querySelectorAll(".switcher-item[data-id]").forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        localStorage.setItem("activeChildId", id);
        view.toggleAccountSwitcher(false);
        window.appController?.navigateToPage("home");
      });
    });

    container
      .querySelector("#btn-switch-parent")
      ?.addEventListener("click", () => {
        localStorage.removeItem("activeChildId");
        view.toggleAccountSwitcher(false);
        window.appController?.navigateToPage("home");
      });

    container
      .querySelector("#btn-switch-add")
      ?.addEventListener("click", () => {
        view.toggleAccountSwitcher(false);
        window.appController?.navigateToPage("registerChild");
      });
  },
};
