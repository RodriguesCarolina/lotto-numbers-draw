/**
 * Object containing API endpoints for the application.
 * @namespace
 * @property {string} saveUnluckyNumbers - Endpoint to save unlucky numbers.
 * @property {string} removeUnluckyNumber - Endpoint to remove unlucky numbers.
 * @property {string} fetchExcludedLottoNumbers - Endpoint to fetch the unlucky numbers which are going to be excluded from generation.
 * @property {string} fetchConstants - Endpoint to load constants for the Lotto Types which were saved in JSON.
 * @type {{getUnluckyNumbers: string, fetchConstants: string, saveUnluckyNumbers: string, removeUnluckyNumber: string, fetchExcludedLottoNumbers: string}}
 */

export const API_URLS = {
    getUnluckyNumbers: '/api/getUnluckyNumbers.php',
    saveUnluckyNumbers: '/api/saveUnluckyNumbers.php',
    removeUnluckyNumber: '/api/removeUnluckyNumber.php',
    fetchExcludedLottoNumbers: '/api/getUnluckyNumbers.php',
    fetchConstants: 'api/loadConstants.php'
};