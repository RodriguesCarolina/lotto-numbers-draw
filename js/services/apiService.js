import {API_URLS} from '../config.js';

/**
 * Handles the responses from fetch requests.
 * @param {Response}  response - The Response object from a fetch call.
 * @returns {Promise<any>} The JSON data from the response.
 * @throws {Error} Shows errors when the response status is not ok (200).
 */
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
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
/**
 * Fetches excluded lotto numbers from server and handles errors.
 * @returns {Promise<number[]>} Returns array of excluded lotto numbers.
 * @throws {Error} Shows Error if the fetch fails or if the data has wrong format.
 */
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

/**
 * Saves the unlucky numbers to the server in a JSON file.
 * @param {number[]} numbers - Array of numbers to be saved as unlucky numbers.
 * @returns {Promise<object>} - The response object from the server.
 * @throws Shows error if the numbers could not be saved
 */
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

/**
 * Fetches the constants for Lotto Type saved in JSON.
 * @returns {Promise<object>} The constants object-
 * @throws Shows error in case the fetch fails.
 */
export async function fetchConstants() {
    try {
        const response = await fetch(API_URLS.fetchConstants);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching constants:', error);
        throw error;
    }
}

/**
 * Removes unlucky number from the server when clicked on the UI.
 * @param {number} numberToRemove - The number to be removed.
 * @returns {Promise<object>} The response object from the server.
 * @throws {Error} When removal fails.
 */
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