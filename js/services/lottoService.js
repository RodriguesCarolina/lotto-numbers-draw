import * as apiService from './apiService.js';

export class LottoService {
    constructor() {
        this.constants = null;
        this.excludedLottoNumbers = [];
    }
    getExcludedLottoNumbers() {
        return this.excludedLottoNumbers;
    }
    async initializeService() {
        await this.loadConstants();
        await this.loadExcludedNumbers();
    }

    async loadConstants() {
        try {
            this.constants = await apiService.fetchConstants();
            console.log('Constants loaded:', this.constants);
        } catch (error) {
            console.error('Failed to load constants:', error);
            throw error;
        }
    }
    async loadExcludedNumbers() {
        try {
            this.excludedLottoNumbers = await apiService.fetchExcludedLottoNumbers();
            console.log('Excluded numbers loaded:', this.excludedLottoNumbers);
        } catch (error) {
            console.error('Failed to load excluded numbers:', error);
            throw error;
        }
    }
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

    validateNewNumbers(newNumbers) {
        let errors = [];
        let validNumbers = [];

        newNumbers.forEach(number => {
            number = Number(number); // Make sure it's a number type for further checks.
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

    isValidLottoType(lottoType) {
        return this.constants && Array.isArray(this.excludedLottoNumbers) && this.constants.maxNumbers[lottoType];
    }

    getLottoTypeDetails(lottoType) {
        return {
            maxNumbers: this.constants.maxNumbers[lottoType],
            numberCount: this.constants.numberCount[lottoType],
            superNumbersMax: this.constants.superNumbersMax[lottoType] || 0,
        };
    }

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
