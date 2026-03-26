export class AppController {
  handleNextStep() {
    const currentStep = this.model.onboardingStep;

    if (currentStep === 0) {
      const name = document.getElementById("ob-name").value;
      this.model.updateData("name", name);
    } else if (currentStep === 1) {
      const age = document.getElementById("ob-age").value;
      this.model.updateData("age", age);
    }

    if (currentStep < 6) {
      this.model.onboardingStep++;
      this.renderOnboarding();
    } else {
      this.finishOnboarding();
    }
  }

  async finishOnboarding() {
    await this.model.saveFullProfile();
    this.navigateToPage("create-adult");
  }
}
