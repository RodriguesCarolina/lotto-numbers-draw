import {LottoService} from "../services/lottoService.js";

export class UiHandler {
    constructor(lottoService) {
        this.lottoService = lottoService;
    }

    async init() {
        await this.lottoService.initializeService();
        await this.updateUnluckyNumbersDisplay();
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.getElementById('generateNumbers').addEventListener('click', () => this.generateAndDisplayLottoNumbers());
        document.getElementById('submitButton').addEventListener('click', () => this.submitUnluckyNumbers());
    }

    async submitUnluckyNumbers() {
        const input = document.getElementById('numberInput');
        const numbers = input.value.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
        try {
            await this.lottoService.addNumbers(numbers);
            console.log('Unlucky numbers updated successfully');
            input.value = '';
            await this.updateUnluckyNumbersDisplay();
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    async generateAndDisplayLottoNumbers() {
        const lottoType = document.querySelector('[name="lottoType"]:checked').value;
        try {
            const { numbers, superNumbers } = await this.lottoService.generateLottoNumbers(lottoType);

            document.getElementById('generatedNumbersDisplay').innerText = `Lucky Numbers: ${numbers.join(', ')}`;
            //console.log('Generated numbers are: ' + numbers);
            //console.log('Generated super numbers are: ' + superNumbers);

            if (superNumbers && superNumbers.length) {
                document.getElementById('superNumbersDisplay').innerText = `Super Numbers: ${superNumbers.join(', ')}`;
            }
        } catch (error) {
            console.error('Error in generating and displaying lotto numbers:', error);
        }
    }

    async updateUnluckyNumbersDisplay() {
        const unluckyNumbersList = document.getElementById('excludedNumbersDisplay');
        const counterDisplay = document.getElementById('unluckyNumbersCounter');

        const excludedNumbers = this.lottoService.getExcludedLottoNumbers();

        unluckyNumbersList.innerHTML = ''; // Clear existing content
        excludedNumbers.forEach(n => {
            const span = document.createElement('span');
            span.className = 'unlucky-number';
            span.textContent = `${n} `;

            const button = document.createElement('button');
            button.textContent = 'X';
            button.addEventListener('click', () => this.removeNumber(n));

            span.appendChild(button);
            unluckyNumbersList.appendChild(span);
        });

        counterDisplay.textContent = `${excludedNumbers.length}/6 Unlucky Numbers Set`;

    }

    showAlert(message, type) {
        console.log(`Showing alert: ${message}, type: ${type}`); // Debugging line
        const alertPlaceholder = document.getElementById('alertPlaceholder');
        if (!alertPlaceholder) {
            console.error("alertPlaceholder not found in the document.");
            return;
        }
        alertPlaceholder.innerHTML = `<div class="alert alert-${type}" role="alert">${message}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;

        setTimeout(() => {
            alertPlaceholder.innerHTML = '';
        }, 5000); // Reduced to 5 seconds for quicker feedback
    }


    async removeNumber(numberToRemove) {
        try {
            await this.lottoService.removeNumber(numberToRemove);
            // Refresh the display of unlucky numbers
            await this.updateUnluckyNumbersDisplay();
        } catch (error) {
            console.error('Error removing number:', error);
            // Optionally, display an error message to the user
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const lottoService = new LottoService();
    await lottoService.initializeService();
    const uiHandler = new UiHandler(lottoService);
    await uiHandler.init();
});

export default UiHandler;