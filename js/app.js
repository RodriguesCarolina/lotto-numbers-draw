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

//refactor this.
/*function checkInput() {
    const input = document.getElementById('numberInput');
    const list = document.getElementById('excludedNumbersDisplay');
    const maxNumbers = 6;
    const numbers = input.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 49);

    //Find better solution, not good:
    list.innerHTML = numbers.map(n => `<span class="unlucky-number">${n} <button onclick="removeNumber(${n})">X</button></span>`).join('');

    input.disabled = numbers.length >= maxNumbers;
}*/

let globalUnluckyNumbers = [];

async function getUnluckyNumbers() {
    try {
        const response = await fetch('api/getUnluckyNumbers.php');
        if (response.ok) {
            const data = await response.json(); // Make sure this returns an array
            // Check if the received data is an array
            if (Array.isArray(data.unluckyNumbers)) {
                globalUnluckyNumbers = data.unluckyNumbers;
            } else {
                // If not, handle the situation appropriately,  set it to an empty array
                globalUnluckyNumbers = [];
            }
        } else {
            // Handle HTTP error
            console.error('HTTP error:', response.status);
        }
    } catch (error) {
        console.error('Error fetching unlucky numbers:', error);
    }
    updateUnluckyNumbersDisplay(); // Update the display after fetching the numbers
}
getUnluckyNumbers().then(() => {
    console.log('Unlucky numbers fetched:', globalUnluckyNumbers);
    // Now this will log after the numbers have been fetched and confirmed to be an array
});
function checkInputAndAddNumbers() {
    const userInput = document.getElementById('numberInput');
    let numberInput = userInput.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && (n <= 49 || n <= 50)); // Use correct upper limit for the lotto game

    // Remove duplicates and filter out numbers that are already in globalUnluckyNumbers
    numberInput = numberInput.filter((number, index, self) =>
        self.indexOf(number) === index && !globalUnluckyNumbers.includes(number)
    );

    // Check if adding the new numbers exceeds the limit of 6
    if (globalUnluckyNumbers.length + numberInput.length > 6) {
        showAlert('Adding these numbers would exceed the maximum allowed unlucky numbers.', 'danger');
        //console.error('Adding these numbers would exceed the maximum allowed unlucky numbers.');
        //return; // Stop further execution
    }

    // Add valid numbers to the global list and update the display
    globalUnluckyNumbers.push(...numberInput);
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

    // If you want the alert to disappear after some time
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

    unluckyNumbersList.innerHTML = globalUnluckyNumbers.map(n =>
        `<span class="unlucky-number">${n} 
        <button onclick="removeNumber(${n})">X</button> 
        </span>`).join('');

    //document.getElementById('numberInput').disabled = globalUnluckyNumbers >= 6;
    counterDisplay.textContent = `${globalUnluckyNumbers.length}/6 Unlucky Numbers Set`;
}

function removeNumber(numberToRemove) {
    globalUnluckyNumbers = globalUnluckyNumbers.filter(n => n !== numberToRemove);
    updateUnluckyNumbersDisplay();
}
updateUnluckyNumbersDisplay();
function generateUniqueRandomNumbers(count, max, excludeNumbers) {
    let uniqueNumbers = [];
    while (uniqueNumbers.length < count) {
        let randomNumber = Math.floor(Math.random() * max) + 1;
        if (!excludeNumbers.includes(randomNumber) && !uniqueNumbers.includes(randomNumber)) {
            uniqueNumbers.push(randomNumber);
        }
    }
    return uniqueNumbers;
}

function generateLottoNumbers() {
    const lotto6aus49 = document.getElementById('lotto6aus49').checked;
    const numbersDisplay = document.getElementById('number-container');
    const superNumbersDisplay = document.getElementById('superNumbersDisplay');

    let excludedNumbers = globalUnluckyNumbers.map(Number);
    let maxNumbers, numberCount, superNumbers, superNumbersMax;

    if (lotto6aus49) {
        maxNumbers = 49;
        numberCount = 6;
    } else {
        //Eurojackpot
        maxNumbers = 50;
        numberCount = 5;
        superNumbersMax = 10;
        superNumbers = generateUniqueRandomNumbers(2, superNumbersMax, globalUnluckyNumbers);
    }
    console.log(superNumbers);
    let numbers = generateUniqueRandomNumbers(numberCount, maxNumbers, excludedNumbers);

    numbersDisplay.innerHTML = `Lucky numbers: ${numbers.join(', ')}`;

    if (superNumbers) {
        superNumbersDisplay.innerHTML = `Super numbers: ${superNumbers.join(', ')}`;
    }
    console.log('the random lucky numbers are ' + numbers);
}

generateLottoNumbers();
