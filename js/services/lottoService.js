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
            console.log('Unlucky numbers saved successfully.');
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

    /*getExcludedLottoNumbers() {
        return this.excludedLottoNumbers;
    }

    addNumbers(newNumbers) {
        // Filter out invalid numbers and duplicates
        const validNumbers = newNumbers.filter((number, index, self) =>
            !isNaN(number) &&
            number >= 1 &&
            (number <= 49 || number <= 50) &&
            self.indexOf(number) === index &&
            !this.excludedLottoNumbers.includes(number)
        );

        // Check if adding the new numbers exceeds the limit
        if (this.excludedLottoNumbers.length + validNumbers.length > 6) {
            throw new Error('Adding these numbers would exceed the maximum allowed unlucky numbers.');
        }

        // Add valid numbers to the excludedLottoNumbers array
        this.excludedLottoNumbers.push(...validNumbers);

        // Save the updated list
        return this.saveUnluckyNumbers(this.excludedLottoNumbers);
    }

    async loadConstantsAndExcludedNumbers() {
        try {
            this.constants = await apiService.fetchConstants();
            console.log('Constants loaded:', this.constants);

            this.excludedLottoNumbers = await apiService.fetchExcludedLottoNumbers();
            console.log('Excluded numbers loaded:', this.excludedLottoNumbers);
        } catch (error) {
            console.error('Failed to load data:', error);
            throw error;
        }
    }

    async removeNumber(numberToRemove) {
        try {
            // Call the API service to remove the number
            await apiService.removeUnluckyNumber(numberToRemove);
            this.excludedLottoNumbers = this.excludedLottoNumbers.filter(n => n !== numberToRemove);

            //refresh the list of excluded numbers from the server
            this.excludedLottoNumbers = await apiService.fetchExcludedLottoNumbers();
        } catch (error) {
            console.error('Failed to remove unlucky number:', error);
            throw error;
        }
    }

    generateUniqueRandomNumbers(count, max, excludeNumbers) {
        if (max - excludeNumbers.length < count) {
            console.error("Anforderung nicht erfüllbar: Nicht genügend Zahlen verfügbar, um die Anfrage zu erfüllen.");
            return [];
        }

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
        if (!this.constants || !Array.isArray(this.excludedLottoNumbers)) {
            console.error('Data not loaded properly.');
            return;
        }

        const maxNumbers = this.constants.maxNumbers[lottoType];
        const numberCount = this.constants.numberCount[lottoType];
        const superNumbersMax = this.constants.superNumbersMax[lottoType] || 0;
        console.log(this.constants); // Check the structure of constants
        console.log('lottoType provided:', lottoType); // Check the lottoType value

        console.log(`Generating ${numberCount} numbers up to ${maxNumbers}, with ${superNumbersMax} super numbers for ${lottoType}.`);

        const numbers = this.generateUniqueRandomNumbers(numberCount, maxNumbers, this.excludedLottoNumbers);
        let superNumbers = [];
        if (superNumbersMax > 0) {
            superNumbers = this.generateUniqueRandomNumbers(2, superNumbersMax, []);
        }

        // Return the numbers and superNumbers for further processing/display
        return { numbers, superNumbers };
    }

    async saveUnluckyNumbers(numbers) {
        // First, check if the current count of excluded numbers plus the new numbers exceed 6
        const currentCount = this.excludedLottoNumbers.length;
        const newNumbersCount = numbers.length;
        const totalCount = currentCount + newNumbersCount;

        if (totalCount > 6) {
            console.error('Cannot save more than 6 unlucky numbers. Please remove some numbers first.');
        }

        try {
            const result = await apiService.saveUnluckyNumbers(numbers);
            if (result && result.success) {
                console.log('Unlucky numbers saved:', result);
                // Update the local state of excluded numbers after saving
                this.excludedLottoNumbers = await apiService.fetchExcludedLottoNumbers();
            } else if (result && result.error) {
                console.error('Failed to save unlucky numbers:', result.error);
            }
        } catch (error) {
            console.error('Failed to save unlucky numbers:', error);
            throw error;
        }
    }*/

}

export default LottoService;
