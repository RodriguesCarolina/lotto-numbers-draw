/**
 * * @fileoverview Entry point for the Lotto Numbers Draw application. This will start the program by setting up services and UI handlers.
 */

import { LottoService } from './services/lottoService.js';
import { UiHandler } from './ui/uiHandler.js';
import * as apiService from './services/apiService.js';

/**
 * Initializes the Lotto Numbers application
 * It sets up the LottoService and UIHandler and then starts-
 * @async
 * @function initializeApplication
 * @returns {Promise<void>}
 */
async function initializeApplication() {
    const lottoService = new LottoService(apiService);
    const uiHandler = new UiHandler(lottoService);

    try {
        await lottoService.initializeService(); // initialization in LottoService
        await uiHandler.init(); // Initialize UI interactions
        console.log('Application initialized successfully.');
    } catch (error) {
        console.error('Initialization error:', error);

        uiHandler.showAlert('An error occurred during application initialization. Please try again later.', 'danger');
    }
}

// Ensures the DOM is fully loaded before starting.
document.addEventListener('DOMContentLoaded', initializeApplication);
