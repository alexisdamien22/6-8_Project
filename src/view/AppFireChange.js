export const AppFireChange = {
  FireTextur(number) {
    const strikNumber = number !== undefined && !isNaN(number) ? number : 0;
    const locate = "/assets/img/icons/strik/flame_";
    const ext = ".png";

    if (strikNumber < 7) return locate + "1" + ext;
    else if (strikNumber < 14) return locate + "2" + ext;
    else if (strikNumber < 21) return locate + "3" + ext;
    else if (strikNumber < 28) return locate + "4" + ext;
    else if (strikNumber < 35) return locate + "5" + ext;
    else if (strikNumber < 42) return locate + "6" + ext;
    else if (strikNumber < 49) return locate + "7" + ext;
    else if (strikNumber < 56) return locate + "8" + ext;
    else if (strikNumber < 63) return locate + "9" + ext;
    else if (strikNumber < 70) return locate + "10" + ext;
    else if (strikNumber < 77) return locate + "11" + ext;
    else if (strikNumber < 84) return locate + "12" + ext;
    else return locate + "12" + ext;
  },
};
