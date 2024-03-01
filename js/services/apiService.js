// /js/services/apiService.js

import { API_URLS } from '../config.js';

export async function fetchExcludedLottoNumbers() {
    try {
        const response = await fetch(API_URLS.fetchExcludedLottoNumbers);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.unluckyNumbers)) {
                return data.unluckyNumbers;
            } else {
                throw new Error("Unexpected format for unlucky numbers");
            }
        } else {
            throw new Error(`HTTP error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching unlucky numbers:', error);
        throw error;
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