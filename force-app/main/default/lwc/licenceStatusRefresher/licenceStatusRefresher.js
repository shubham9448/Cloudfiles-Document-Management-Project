import { LightningElement, api } from 'lwc';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';

const POLL_INTERVAL_MS = 5000;

export default class LicenceStatusRefresher extends LightningElement {
    @api recordId;

    lastChecked = '';
    timer;

    connectedCallback() {
        this.refresh();
        this.timer = setInterval(() => this.refresh(), POLL_INTERVAL_MS);
    }

    disconnectedCallback() {
        clearInterval(this.timer);
    }

    async refresh() {
        // Skip while the browser tab is in the background to avoid needless server calls.
        if (document.hidden || !this.recordId) {
            return;
        }
        try {
            await notifyRecordUpdateAvailable([{ recordId: this.recordId }]);
            this.lastChecked = new Date().toLocaleTimeString();
        } catch (error) {
            // A failed poll is harmless; the next tick tries again.
        }
    }
}