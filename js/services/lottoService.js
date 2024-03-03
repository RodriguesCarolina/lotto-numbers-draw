import * as apiService from './apiService.js';

/**
 * Provides services for managing lotto numbers, including adding and removing the unlucky numbers
 * generating random numbers and loading necessary constants and numbers from server.
 */
export class LottoService {
    /**
     * Initializes a new instance of the LottoService class.
     */
    constructor() {
        /** @property {Object|null} constants - Stores constants loaded from the server. */
        this.constants = null;

        /** @property {number[]} excludedLottoNumbers - Stores the unlucky numbers defined by the user. */
        this.excludedLottoNumbers = [];
    }
    getExcludedLottoNumbers() {
        return this.excludedLottoNumbers;
    }

    /**
     * Initializes the service by loading constants and excluded numbers from server.
     * @returns {Promise<void>}
     */
    async initializeService() {
        await this.loadConstants();
        await this.loadExcludedNumbers();
    }

    /**
     * Loads constants from server.
     * @throws {Error} Shows error if the constants could not be loaded.
     * @returns {Promise<void>}
     */
    async loadConstants() {
        try {
            this.constants = await apiService.fetchConstants();
            console.log('Constants loaded:', this.constants);
        } catch (error) {
            console.error('Failed to load constants:', error);
            throw error;
        }
    }

    /**
     * Loads excluded (unlucky) numbers from the server.
     * @throws {Error}  If the excluded numbers could not be loaded.
     * @returns {Promise<void>}
     */
    async loadExcludedNumbers() {
        try {
            this.excludedLottoNumbers = await apiService.fetchExcludedLottoNumbers();
            console.log('Excluded numbers loaded:', this.excludedLottoNumbers);
        } catch (error) {
            console.error('Failed to load excluded numbers:', error);
            throw error;
        }
    }

    /**
     * Validates and adds new numbers to the list of excluded numbers, ensuring that the limit is 6.
     * @param {number[]} newNumbers - Array that contains new numbers added by the user.
     * @throws Shows error in case the numbers are not valid or if the limit is exceeded.
     * @returns {Promise<void>}
     */
    async addNumbers(newNumbers) {
        const { validNumbers, errors } = this.validateNewNumbers(newNumbers);

        if (errors.length > 0) {
            throw new Error(errors.join(' ')); // Combine all error messages.
        }

        if (this.excludedLottoNumbers.length + validNumbers.length > 6) {
            throw new Error('Adding these numbers would exceed the maximum of 6 unlucky numbers.');
        }
        // If the total doesn't exceed 6, proceed to update and save
        const updatedList = [...this.excludedLottoNumbers, ...validNumbers].slice(0, 6);
        await this.saveUnluckyNumbers(updatedList);
    }

    /**
     * Validates new numbers to be added to the list of excluded numbers-
     * @param {number[]} newNumbers - The new numbers to validate.
     * @returns {{validNumbers: number[], errors: string[]}} An object containing arrays of valid numbers and error messages.
     */
    validateNewNumbers(newNumbers) {
        let errors = [];
        let validNumbers = [];

        newNumbers.forEach(number => {
            number = Number(number); // Makes sure it's a number type for further checks.
            if (isNaN(number)) {
                errors.push(`"${number}" is not a valid number.`);
            } else if (number <= 0 || number > 50) {
                errors.push(`"${number}" is out of valid range (1-50).`);
            } else if (this.excludedLottoNumbers.includes(number)) {
                errors.push(`"${number}" is already in your list of unlucky numbers.`);
            } else {
                validNumbers.push(number);
            }
        });

        return { validNumbers, errors };
    }

    /**
     * Generates a list of unique numbers, excluding especific (unlucky) numbers.
     * @param {number} count - The amount of unique random numbers to generate.
     * @param {number} max - The maximum value for generated numbers.
     * @param {number[] }excludeNumbers - An array of numbes to exclude from generation.
     * @returns {number[]} - An array of unique random numbers.
     */
    generateUniqueRandomNumbers(count, max, excludeNumbers) {
        let uniqueNumbers = [];
        while (uniqueNumbers.length < count) {
            let randomNumber = Math.floor(Math.random() * max) + 1;
            if (!excludeNumbers.includes(randomNumber) && !uniqueNumbers.includes(randomNumber)) {
                uniqueNumbers.push(randomNumber);
            }
        }
        return uniqueNumbers;
    }

    /**
     * Generates lotto numbers for a given lotto type, considering the numbers to be excluded.
     * @param {string} lottoType - The type of lotto numbers to be generated: Lotto6aus49 or Eurojackpot.
     * @returns {{numbers: number[], superNumbers: number[]}} An object containing arrays of generated numbers and super numbers for Erojackpot.
     * @throws {Error} Shows error if the lotto type is invalid or data not loaded properly.
     */
    generateLottoNumbers(lottoType) {
        if (!this.isValidLottoType(lottoType)) {
            console.error('Invalid lotto type or data not loaded properly.');
            return { numbers: [], superNumbers: [] };
        }

        const { maxNumbers, numberCount, superNumbersMax } = this.getLottoTypeDetails(lottoType);
        const numbers = this.generateUniqueRandomNumbers(numberCount, maxNumbers, this.excludedLottoNumbers);
        const superNumbers = superNumbersMax > 0 ? this.generateUniqueRandomNumbers(2, superNumbersMax, []) : [];

        console.log(`Generated numbers for ${lottoType}:`, { numbers, superNumbers });
        return { numbers, superNumbers };
    }

    /**
     * Checks if the lotto type provided is valid based on the loaded constants.
     * @param {string} lottoType - The lotto type to be validated.
     * @returns {boolean} True if the lotto type is valid, false if not valid.
     */
    isValidLottoType(lottoType) {
        return this.constants && Array.isArray(this.excludedLottoNumbers) && this.constants.maxNumbers[lottoType];
    }

    /**
     * Retrieves the lotto type details from constants-
     * @param {string} lottoType - The Lotto type to get details
     * @returns {Object} containing details about the lotto type.
     */
    getLottoTypeDetails(lottoType) {
        return {
            maxNumbers: this.constants.maxNumbers[lottoType],
            numberCount: this.constants.numberCount[lottoType],
            superNumbersMax: this.constants.superNumbersMax[lottoType] || 0,
        };
    }

    /**
     * Saves the current list of excluded (unlucky) nnumbers to the server.
     * @async
     * @param {number[] }numbers - The list of numbers to save.
     * @throws Shows error if saving fails.
     * @returns {Promise<void>}
     */
    async saveUnluckyNumbers(numbers) {
        try {
            const result = await apiService.saveUnluckyNumbers(numbers);
            if (!result.success) throw new Error(result.error || 'Failed to save unlucky numbers.');
            //console.log('Unlucky numbers saved successfully.');
            await this.loadExcludedNumbers(); // Refresh the list of excluded numbers
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }

    /**
     * Removes a specific number from the list of excluded numbers.
     * @async
     * @param {number} numberToRemove - The number to remove from the list.
     * @throws {Error}  Shows error if removing fails.
     * @returns {Promise<void>}
     */
    async removeNumber(numberToRemove) {
        try {
            // Call the API service to remove the number
            let result = await apiService.removeUnluckyNumber(numberToRemove);
            if (result.success) {
                //re-index to prevent wholes in array when removing the numbers:
                this.excludedLottoNumbers = this.excludedLottoNumbers.filter(n => n !== numberToRemove);
                this.excludedLottoNumbers = [...this.excludedLottoNumbers]; // This re-indexes the array
                console.log('Number removed successfully:', numberToRemove);
            } else {
                console.error('Failed to remove unlucky number:', result.error);
            }
        } catch (error) {
            console.error('Failed to remove unlucky number:', error);
            throw error;
        }
    }
}

export default LottoService;
