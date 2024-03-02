import { LottoService } from './services/lottoService.js';
import { UiHandler } from './ui/uiHandler.js';
import * as apiService from './services/apiService.js';

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

document.addEventListener('DOMContentLoaded', initializeApplication);
