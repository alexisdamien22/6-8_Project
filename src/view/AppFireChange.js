export const AppFireChange = {
  FireTextur(number) {
    const strikNumber = localStorage.getItem("strik");
    const locate = "./assets/img/icons/strik/flame_";
    const ext = ".png";

    if (strikNumber === null || strikNumber < 7) return locate + "1" + ext;
    else if (strikNumber < 14) return locate + "2" + ext;
    else if (strikNumber < 21) return locate + "3" + ext;
    else if (strikNumber < 28) return locate + "4" + ext;
  },
};
