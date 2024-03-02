// /js/services/apiService.js

import { API_URLS } from '../config.js';

// Helper function for handling fetch responses
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// Fetches excluded lotto numbers with error handling
export async function fetchExcludedLottoNumbers() {
    try {
        const response = await fetch(API_URLS.fetchExcludedLottoNumbers);
        const data = await handleResponse(response);
        if (!Array.isArray(data.unluckyNumbers)) {
            throw new Error("Unexpected format for unlucky numbers");
        }
        return data.unluckyNumbers;
    } catch (error) {
        console.error('Error fetching unlucky numbers:', error);
        throw error;
    }
}

export async function getUnluckyNumbers() {
    try {
        const response = await fetch(API_URLS.getUnluckyNumbers);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching unlucky numbers:', error);
        throw error;
    }
}

export async function saveUnluckyNumbers(numbers) {
    try {
        const response = await fetch(API_URLS.saveUnluckyNumbers, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unluckyNumbers: numbers }),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error saving unlucky numbers:', error);
        throw error;
    }
}

export async function fetchConstants() {
    try {
        const response = await fetch(API_URLS.fetchConstants);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching constants:', error);
        throw error;
    }
}

export async function removeUnluckyNumber(numberToRemove) {
    try {
        const response = await fetch(API_URLS.removeUnluckyNumber, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number: numberToRemove }),
        });
        const result = await handleResponse(response);
        if (result.error) {
            throw new Error(result.error);
        }
        return result;
    } catch (error) {
        console.error('Error removing unlucky number:', error);
        throw error;
    }
}