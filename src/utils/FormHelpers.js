export function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function isStepValid(step, isLoginMode, isLoading, state, loginState) {
  if (isLoading) return false;

  if (isLoginMode) {
    return Boolean(
      loginState?.email?.includes("@") && loginState?.password?.length >= 4,
    );
  }

  switch (step) {
    case 1:
      return Boolean(
        state.email?.includes("@") &&
        state.password?.length >= 8 &&
        state.password === state.confirmPassword,
      );
    case 2: {
      const age = parseInt(state.age, 10);
      return !isNaN(age) && age >= 5 && age <= 99;
    }
    case 3:
      return Boolean(state.instrument);
    case 4: {
      const duration = parseInt(state.duree, 10);
      const age = parseInt(state.age, 10);
      return !isNaN(duration) && duration >= 0 && duration <= age;
    }
    case 5:
      return Boolean(state.ecole?.trim().length > 0);
    case 6:
      return Boolean(state.mascotte);
    case 7:
      return Array.isArray(state.jours) && state.jours.length > 0;
    default:
      return false;
  }
}
