export class AppController {
    handleNextStep() {
        const currentStep = this.model.onboardingStep;

        // 1. Récupérer la valeur selon l'étape
        if (currentStep === 0) {
            const name = document.getElementById('ob-name').value;
            this.model.updateData('name', name);
        } else if (currentStep === 1) {
            const age = document.getElementById('ob-age').value;
            this.model.updateData('age', age);
        }
        // ... etc pour chaque ID d'input

        // 2. Avancer ou Terminer
        if (currentStep < 6) {
            this.model.onboardingStep++;
            this.renderOnboarding();
        } else {
            this.finishOnboarding();
        }
    }

    async finishOnboarding() {
        await this.model.saveFullProfile();
        // Une fois l'enfant créé, on affiche l'écran "Créer compte parent"
        this.navigateToPage('create-adult');
    }
}