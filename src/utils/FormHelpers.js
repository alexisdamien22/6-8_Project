export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function isStepValid(step, isLoginMode, isLoading, state, loginState) {
  if (isLoading) return false;

  if (isLoginMode) {
    return loginState.email.includes("@") && loginState.password.length >= 4;
  }

  const isParentInfoValid =
    state.email.includes("@") && state.password.length >= 4;

  switch (step) {
    case 1:
      return state.name.trim().length >= 2 && isParentInfoValid;
    case 2: {
      const a = parseInt(state.age);
      return !isNaN(a) && a >= 5 && a <= 99;
    }
    case 3:
      return state.instrument !== "";
    case 4: {
      const d = parseInt(state.duree);
      const a = parseInt(state.age);
      return !isNaN(d) && d >= 0 && d <= a;
    }
    case 5:
      return state.ecole.trim().length > 0;
    case 6:
      return state.mascotte !== "";
    case 7:
      return state.jours.length > 0;
    default:
      return false;
  }
}
