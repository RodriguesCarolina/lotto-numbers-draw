import { LottoService } from './services/lottoService.js';
import { UiHandler } from './ui/uiHandler.js';
import * as apiService from './services/apiService.js';

const lottoService = new LottoService(apiService);

// Pass the LottoService instance to UiHandler for UI-related operations
const uiHandler = new UiHandler(lottoService);

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize necessary data and UI components
        await lottoService.loadConstantsAndExcludedNumbers(); // Load constants and excluded numbers
        uiHandler.init(); // Setup UI interactions
    } catch (error) {
        console.error('Initialization error:', error);
        // Optionally handle initialization errors, e.g., show an error message to the user
    }
});
