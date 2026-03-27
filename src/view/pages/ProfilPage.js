import { AppFireChange } from "../AppFireChange.js";

export const ProfilPage = {
  getHTML: (data) => {
    const mascot = data?.mascotte || "👤";
    const name = data?.name || "Profil";
    const currentStreak =
      data?.streakData?.current_streak || localStorage.getItem("streak") || "0";
    const instrument = data?.instrument
      ? data.instrument.charAt(0).toUpperCase() + data.instrument.slice(1)
      : "-";

    return `
      <div class="profile-page">
        <div class="profil-img" style="display: flex; align-items: center; justify-content: center; font-size: 4rem;">
          ${mascot}
        </div>
        <p class="profil-name">${name}</p>

        <div class="stats-row">
          <div class="card">
            <h3>Série actuelle</h3>
            <div class="strik" style="margin-top: 10px; justify-content: center;">
              <img class="strik-icon" src="${AppFireChange.FireTextur(parseInt(currentStreak))}" alt="flame">
              <span class="strik-text">${currentStreak}</span>
            </div>
          </div>
          <div class="card">
            <h3>Instrument</h3>
            <p style="font-size: 1.2rem; margin-top: 10px;">${instrument}</p>
          </div>
        </div>

        <div class="history-section">
          <h3>Historique des séances</h3>
        </div>
      </div>
    `;
  },
};
