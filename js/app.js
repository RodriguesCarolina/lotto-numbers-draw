class LottoHandler {
    constructor() {
        this.excludedLottoNumbers = [];
        this.constants = null;
    }

    async fetchConstants() {
        try {
            const response = await fetch('api/loadConstants.php');
            if (!response.ok) {
                console.error('Failed to load constants due to response status:', response.status);
            }
            this.constants = await response.json();
            console.log('Constants loaded:', this.constants);
        } catch (error) {
            console.error('Error fetching constants:', error);
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


    async fetchExcludedLottoNumbers() {
        try {
            const response = await fetch('api/getUnluckyNumbers.php');
            if (response.ok) {
                const data = await response.json(); // Stellt sicher, dass dies ein Objekt zurückgibt
                // Stellen Sie sicher, dass die Daten im erwarteten Format sind
                if (Array.isArray(data.unluckyNumbers)) {
                    this.excludedLottoNumbers = data.unluckyNumbers;
                    console.log('Excluded numbers fetched:', this.excludedLottoNumbers);
                } else {
                    console.error("Unexpected format for unlucky numbers");
                    this.excludedLottoNumbers = [];
                }
            } else {
                console.error('HTTP error:', response.status);
            }
        } catch (error) {
            console.error('Error fetching unlucky numbers:', error);
        }
    }

    generateLottoNumbers(lottoType) {
        if (!this.constants) {
            console.log('constants are not loaded');
        }
        console.log('Current excluded numbers:', this.excludedLottoNumbers);

        const maxNumbers = this.constants.maxNumbers[lottoType];
        const numberCount = this.constants.numberCount[lottoType];
        const superNumbersMax = this.constants.superNumbersMax[lottoType] || 0;

        console.log(`Generating ${numberCount} numbers up to ${maxNumbers}, with ${superNumbersMax} super numbers for ${lottoType}.`);

        const numbers = this.generateUniqueRandomNumbers(numberCount, maxNumbers, this.excludedLottoNumbers);
        let superNumbers = [];
        if (superNumbersMax > 0) {
            superNumbers = this.generateUniqueRandomNumbers(2, superNumbersMax, []);
        }

        this.displayLottoNumbers(numbers, superNumbers);
    }

    displayLottoNumbers(numbers, superNumbers = []) {
        const numbersDisplay = document.getElementById('number-container');
        const superNumbersDisplay = document.getElementById('superNumbersDisplay');

        numbersDisplay.innerHTML = `Lucky Numbers: ${numbers.join(', ')}`;
        if (superNumbers.length > 0) {
            superNumbersDisplay.innerHTML = `Super Numbers: ${superNumbers.join(', ')}`;
        }
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const lottoHandler = new LottoHandler();
    await lottoHandler.fetchConstants();
    await lottoHandler.fetchExcludedLottoNumbers();
    // Event-Listener für den Button hinzufügen
    document.getElementById('generateNumbers').addEventListener('click', () => {

        const lottoType = document.getElementById('lotto6aus49').checked ? 'Lotto6aus49' : 'EuroJackpot';
        lottoHandler.generateLottoNumbers(lottoType);
        //console.log(excludedLottoNumbers);
    });
});
function saveUnluckyNumbers(numbers) {
    fetch('api/saveUnluckyNumbers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({unluckyNumbers: numbers})
    })
        .then(response => {
            if (response.ok && response.status === 200) {
                return response.json(); // Parse JSON only if the response is not empty
            } else {
                throw new Error('Response was not OK');
            }
        })
        .then(data => {
            if (data && data.success) {
                console.log('Unglückszahlen gespeichert');
                //generateLuckyNumbers();
            } else {
                console.error('Fehler beim Speichern der Zahlen.');
            }
        });
}

let excludedLottoNumbers = [];
async function getUnluckyNumbers() {
    try {
        const response = await fetch('api/getUnluckyNumbers.php');
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.unluckyNumbers)) {
                excludedLottoNumbers = data.unluckyNumbers;
            } else {
                excludedLottoNumbers = [];
            }
        } else {
            console.error('HTTP error:', response.status);
        }
    } catch (error) {
        console.error('Error fetching unlucky numbers:', error);
    }
    updateUnluckyNumbersDisplay(); // Update the display after fetching the numbers
}
getUnluckyNumbers().then(() => {
    console.log('Unlucky numbers fetched:', excludedLottoNumbers);
});
function checkInputAndAddNumbers() {
    const userInput = document.getElementById('numberInput');
    let numberInput = userInput.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && (n <= 49 || n <= 50)); // Use correct upper limit for the lotto game

    // Remove duplicates and filter out numbers that are already in excludedLottoNumbers
    numberInput = numberInput.filter((number, index, self) =>
        self.indexOf(number) === index && !excludedLottoNumbers.includes(number)
    );

    // Check if adding the new numbers exceeds the limit of 6
    if (excludedLottoNumbers.length + numberInput.length > 6) {
        showAlert('Adding these numbers would exceed the maximum allowed unlucky numbers.', 'danger');
    }

    // Add valid numbers to the global list and update the display
    excludedLottoNumbers.push(...numberInput);
    updateUnluckyNumbersDisplay();
    userInput.value = ''; // Clear the input after adding numbers
}
function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alert = `<div class="alert alert-${type}" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
    alertPlaceholder.innerHTML = alert;

    setTimeout(() => {
        alertPlaceholder.innerHTML = ''; // Clear the alert after 5 seconds
    }, 5000);
}
function submitNumbers() {
    let input = document.getElementById('numberInput').value;
    let numbers = input.split(',').map(function(item) {
        return parseInt(item, 10);
    });
    saveUnluckyNumbers(numbers);
    checkInputAndAddNumbers();
}
function updateUnluckyNumbersDisplay() {
    const unluckyNumbersList = document.getElementById('excludedNumbersDisplay');
    const counterDisplay = document.getElementById('unluckyNumbersCounter');

    unluckyNumbersList.innerHTML = excludedLottoNumbers.map(n =>
        `<span class="unlucky-number">${n} 
        <button onclick="removeNumber(${n})">X</button> 
        </span>`).join('');

    counterDisplay.textContent = `${excludedLottoNumbers.length}/6 Unlucky Numbers Set`;
}
function removeNumber(numberToRemove) {
    excludedLottoNumbers = excludedLottoNumbers.filter(n => n !== numberToRemove);
    updateUnluckyNumbersDisplay();
}
updateUnluckyNumbersDisplay();
