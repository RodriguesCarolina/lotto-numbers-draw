import {LottoService} from "../services/lottoService.js";

export class UiHandler {
    constructor(lottoService) {
        this.lottoService = lottoService;
    }

    async init() {
        await this.lottoService.loadConstantsAndExcludedNumbers();
        this.attachEventListeners();
        //this.updateUnluckyNumbersDisplay();
    }

    attachEventListeners() {
        document.getElementById('generateNumbers').addEventListener('click', () => this.generateAndDisplayLottoNumbers());
        document.getElementById('submitButton').addEventListener('click', () => this.submitUnluckyNumbers());
    }

    async submitUnluckyNumbers() {
        const input = document.getElementById('numberInput');
        const numbers = input.value.split(',').map(Number).filter(n => !isNaN(n) && n > 0);

            await this.lottoService.saveUnluckyNumbers(numbers);
            console.log('Unlucky numbers saved successfully');
            input.value = '';
            //await this.fetchAndDisplayExcludedNumbers();
        await this.checkInputAndAddNumbers();
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

        unluckyNumbersList.innerHTML = excludedNumbers.map(n =>
            `<span class="unlucky-number">${n} 
            <button onclick="this.removeNumber(${n})">X</button> 
            </span>`).join('');

        counterDisplay.textContent = `${excludedNumbers.length}/6 Unlucky Numbers Set`;

    }

    showAlert(message, type) {
        const alertPlaceHolder = document.getElementById('alertPlaceholder');
        alertPlaceHolder.innerHTML = `<div class="alert alert-${type}" role="alert">
                         ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;

        setTimeout(() => {
            alertPlaceHolder.innerHTML = '';
        }, 10000);
    }
    async checkInputAndAddNumbers() {
        const userInput = document.getElementById('numberInput');
        const numberInput = userInput.value.split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n) && n > 0);

        try {
            await this.lottoService.addNumbers(numberInput);
            await this.updateUnluckyNumbersDisplay(); // Make sure this method is implemented to update the UI
        } catch (error) {
            this.showAlert(error.message, 'danger'); // Make sure showAlert is implemented
        }

        userInput.value = ''; // Clear the input field
    }
    removeNumber(numberToRemove) {
        this.lottoService.removeNumber(numberToRemove);
        this.updateUnluckyNumbersDisplay();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const apiService = {}; // Import or define your API service here
    const lottoService = new LottoService(apiService);
    await lottoService.loadConstantsAndExcludedNumbers();
    const uiHandler = new UiHandler(lottoService);
    await uiHandler.init();
});

export default UiHandler;