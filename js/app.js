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

function getUnluckyNumbers() {
    fetch('api/getUnluckyNumbers.php')
        .then(response => response.json())
        .then(data => {
            const numbersDisplay = document.getElementById('excludedNumbersDisplay');
            numbersDisplay.textContent = data.unluckyNumbers.join(' ');

        })
        .catch(error => {
            console.error('Error fetching unlucky numbers:', error);
        });
}

function submitNumbers() {
    let input = document.getElementById('numberInput').value;
    let numbers = input.split(',').map(function(item) {
        return parseInt(item, 10);
    });
    //console.log(numbers);
    saveUnluckyNumbers(numbers);
    getUnluckyNumbers();
}