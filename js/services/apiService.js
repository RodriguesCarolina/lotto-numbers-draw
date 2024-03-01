// /js/services/apiService.js

import { API_URLS } from '../config.js';

export async function fetchExcludedLottoNumbers() {
    try {
        const response = await fetch(API_URLS.fetchExcludedLottoNumbers);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.unluckyNumbers)) {
            throw new Error("Unexpected format for unlucky numbers");
        }
        return data.unluckyNumbers;
    } catch (error) {
        console.error('Error fetching unlucky numbers:', error);
        throw error; // Ensure that this error is caught and handled in the calling code
    }
}


export async function getUnluckyNumbers() {
    const response = await fetch(API_URLS.getUnluckyNumbers);
        if (!response.ok) {
            throw new Error('HTTP error! status: ${response.status}');
        }
        return await response.json();
}

export async function saveUnluckyNumbers(numbers) {
    const response = await fetch(API_URLS.saveUnluckyNumbers, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({unluckyNumbers: numbers}),
    });
    if (!response.ok) {
        throw new Error ('HTTP error! status: ${response.status}');
    }
    return await response.json();
}

export async function fetchConstants() {
    const response = await fetch(API_URLS.fetchConstants);
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching constants:', error);
        throw error;
    }

}

export async function removeUnluckyNumber(numberToRemove) {
    try {
        const response = await fetch(API_URLS.removeUnluckyNumber, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: numberToRemove })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        return result;
    } catch (error) {
        console.error('Error removing unlucky number:', error);
        throw error; // Rethrow the error so it can be caught and handled by the calling code
    }
}