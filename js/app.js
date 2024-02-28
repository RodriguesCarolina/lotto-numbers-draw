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
function checkInput() {
    const input = document.getElementById('numberInput');
    const list = document.getElementById('excludedNumbersDisplay');
    const maxNumbers = 6;
    const numbers = input.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 49);

    //Find better solution, not good:
    list.innerHTML = numbers.map(n => `<span class="unlucky-number">${n} <button onclick="removeNumber(${n})">X</button></span>`).join('');

    input.disabled = numbers.length >= maxNumbers;
}

let globalUnluckyNumbers = [];

async function getUnluckyNumbers() {
    try {
        const response = await fetch('api/getUnluckyNumbers.php');
         // data is the array of numbers
        globalUnluckyNumbers = await response.json(); // Set the global unlucky numbers to the data received
        console.log('Unlucky numbers fetched:', globalUnluckyNumbers);
    } catch (error) {
        console.error('Error fetching unlucky numbers:', error);
    }
}

getUnluckyNumbers().then(() => {
    console.log(globalUnluckyNumbers); // This will log after the numbers have been fetched
})

/*function updateUnluckyNumbers() {
    const unluckyNumbersList = document.getElementById('excludedNumbersDisplay');
    unluckyNumbersList.innerHTML = globalUnluckyNumbers.map(n =>
        `<span class="unlucky-number">${n} 
        <button onclick="removeNumber(${n})">X</button> 
        </span>`).join('');

    document.getElementById('numberInput').disabled = globalUnluckyNumbers >= 6;
}*/

/*function checkInputAndAddNumbers() {
    const userInput = document.getElementById('numberInput');
    let numberInput = parseInt(userInput.value.trim());

    if (!isNaN(numberInput) &&
        numberInput >= 1 &&
        numberInput <= 49 &&
        !globalUnluckyNumbers.includes(numberInput)) {

        if (globalUnluckyNumbers.length > 6) {
            globalUnluckyNumbers.push(numberInput);
            saveUnluckyNumbers(globalUnluckyNumbers);
        } else {
            console.error('Maximum number of unlucky numbers reached.');
        }
    } else {
        console.error('Invalid input or number already in the list');
    }
    userInput.
}*/

function submitNumbers() {
    let input = document.getElementById('numberInput').value;
    let numbers = input.split(',').map(function(item) {
        return parseInt(item, 10);
    });
    console.log('hallo');
    saveUnluckyNumbers(numbers);
}

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
