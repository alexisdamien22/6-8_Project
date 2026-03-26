export const ProfilPage = {
  getHTML: function () {
    return `
    <div class="profile-page">
      
        <img class="profil-img" src="/assets/img/other/base-profil.jpg" alt="Profil">

      <p class="profil-name">Shrek Fée</p>

      <div class="stats-row">
        <div class="card">
          <h3>Récap</h3>

        </div>
        <div class="card">
          <h3>Meilleurs Amis</h3>

        </div>
      </div>

      <div class="history-section">
        <h3>Historique des séances</h3>
 
      </div>

      
    </div>
  `;
  },
};
