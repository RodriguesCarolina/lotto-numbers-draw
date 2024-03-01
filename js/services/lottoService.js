import * as apiService from './apiService.js';

export class LottoService {
    constructor() {
        this.constants = null;
        this.excludedLottoNumbers = [];
    }

    getExcludedLottoNumbers() {
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
        try {
            const result = await apiService.saveUnluckyNumbers(numbers);
            console.log('Unlucky numbers saved:', result);
            // Possibly update the local state of excluded numbers after saving
            this.excludedLottoNumbers = await apiService.fetchExcludedLottoNumbers();
        } catch (error) {
            console.error('Failed to save unlucky numbers:', error);
            throw error;
        }
    }
}

export default LottoService;
