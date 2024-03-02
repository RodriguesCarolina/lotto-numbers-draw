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
        const numbers = input.value.split(',')
            .map(n => parseInt(n.trim(), 10))
            .filter(n => !isNaN(n) && n > 0);

        try {
            console.log('Attempting to add numbers:', numbers);
            await this.lottoService.addNumbers(numbers);
        } catch (error) {
            console.error('Error caught in submitUnluckyNumbers:', error);
            this.showAlert(error.message, 'danger');
        } finally {
            input.value = '';
            await this.updateUnluckyNumbersDisplay();
        }
    }



    async generateAndDisplayLottoNumbers() {
        const lottoType = document.querySelector('[name="lottoType"]:checked').value;
        try {
            const { numbers, superNumbers } = await this.lottoService.generateLottoNumbers(lottoType);

            // Clear previous numbers
            const generatedNumbersDisplay = document.getElementById('generatedNumbersDisplay');
            generatedNumbersDisplay.innerHTML = '';

            // Create a container for lucky numbers
            const luckyNumbersContainer = document.createElement('div');
            luckyNumbersContainer.className = 'd-flex align-items-center justify-content-center';

            // Iterate over the numbers and create a circle for each
            numbers.forEach(number => {
                const numberCircle = document.createElement('div');
                numberCircle.className = 'number-circle';
                numberCircle.textContent = number;
                luckyNumbersContainer.appendChild(numberCircle);
            });

            // Append the container to the main display
            generatedNumbersDisplay.appendChild(luckyNumbersContainer);

            const superNumbersDisplay = document.getElementById('superNumbersDisplay');
            superNumbersDisplay.innerHTML = '';

            if (superNumbers && superNumbers.length) {
                superNumbers.forEach(number => {
                    const superNumberCircle = document.createElement('div');
                    superNumberCircle.className = 'number-circle super-number';
                    superNumberCircle.textContent = number;
                    document.getElementById('superNumbersDisplay').appendChild(superNumberCircle);
                });
            }
        } catch (error) {
            console.error('Error in generating and displaying lotto numbers:', error);
        }
    }


    async updateUnluckyNumbersDisplay() {
        const unluckyNumbersList = document.getElementById('excludedNumbersDisplay');
        unluckyNumbersList.innerHTML = ''; // Clear existing content

        const excludedNumbers = this.lottoService.getExcludedLottoNumbers();

        // Iterate over each number and create a circle and button for it
        excludedNumbers.forEach(n => {
            const numberCircle = document.createElement('div');
            numberCircle.className = 'number-circle';
            numberCircle.textContent = n;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.className = 'remove-number-btn';
            removeButton.onclick = () => this.removeNumber(n);

            const numberContainer = document.createElement('div');
            numberContainer.className = 'number-container';
            numberContainer.appendChild(numberCircle);
            numberContainer.appendChild(removeButton);

            unluckyNumbersList.appendChild(numberContainer);
        });

        // Update the counter display
        const counterDisplay = document.getElementById('unluckyNumbersCounter');
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
        }, 5000);
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