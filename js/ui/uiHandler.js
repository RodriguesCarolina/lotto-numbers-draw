/**
 * Handles all UI interactions for the Lotto Numbers Generator application
 * @class
 * @param {LottoService} lottoService - Service used for managing the Lotto Numbers and API interactions.
 */

import {LottoService} from "../services/lottoService.js";

export class UiHandler {
    constructor(lottoService) {
        /**
         * @type {lottoService}
         * @private
         */
        this.lottoService = lottoService;
    }

    /**
     * Initializes the UI handler by setting the service and attaching event listeners.
     * @returns {Promise<void>}
     */
    async init() {
        await this.lottoService.initializeService();
        await this.updateUnluckyNumbersDisplay();
        this.attachEventListeners();
    }

    /**
     * Attaches click event listeners to UI elements for generating and submitting numbers.
     */
    attachEventListeners() {
        document.getElementById('generateNumbers').addEventListener('click', () => this.generateAndDisplayLottoNumbers());
        document.getElementById('submitButton').addEventListener('click', () => this.submitUnluckyNumbers());
    }

    /**
     * Submits the unlucky numbers entered by the users and then updates the UI accordingly.
     * @async
     * @returns {Promise<void>}
     */
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

    /**
     * Generates and displays lotto numbers based on the lotto type.
     * @async
     * @returns {Promise<void>}
     */

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

    /**
     * Updates the display of unlucky numbers on the UI.
     * @async
     * @returns {Promise<void>}
     */
    async updateUnluckyNumbersDisplay() {
        const unluckyNumbersList = document.getElementById('excludedNumbersDisplay');
        unluckyNumbersList.innerHTML = ''; // Clear existing content
        unluckyNumbersList.className = 'd-flex align-items-center justify-content-center flex-wrap';

        const excludedNumbers = this.lottoService.getExcludedLottoNumbers();

        // Iterate over each number and create a circle and button for it
        excludedNumbers.forEach(n => {
            const numberContainer = document.createElement('div');
            numberContainer.className = 'number-container d-flex align-items-center';

            const numberCircle = document.createElement('div');
            numberCircle.className = 'number-circle';
            numberCircle.textContent = n;

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-number-btn btn btn-danger';
            removeButton.textContent = 'X';
            removeButton.onclick = () => this.removeNumber(n);
            removeButton.title = 'Remove this number';

            numberContainer.appendChild(numberCircle);
            numberContainer.appendChild(removeButton);
            unluckyNumbersList.appendChild(numberContainer);
        });

        // Update the counter display
        const counterDisplay = document.getElementById('unluckyNumbersCounter');
        counterDisplay.textContent = `${excludedNumbers.length}/6 Unlucky Numbers Saved`;
    }

    /**
     * Display an alert message on the UI in case the input is not correct.
     * @param {string} message - The message to display in the alert
     * @param {string} type - The type of alert will influence the styling on bootstrap. ('success' is green, 'danger' is red).
     */
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

    /**
     * Removes a specific  unlucky number and updates the UI.
     * @param  {number} numberToRemove
     * @async
     * @returns {Promise<void>}
     */
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