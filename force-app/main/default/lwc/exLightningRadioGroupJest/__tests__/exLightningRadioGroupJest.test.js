import { createElement } from 'lwc';
import exLightningRadioGroupJest from 'c/exLightningRadioGroupJest';

describe('ex-Lightning-Radio-Group-Jest', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Display selected option on radio group', () => {
        // Create element
        const element = createElement('c-ex-Lightning-Radio-Group-Jest', {
            is: exLightningRadioGroupJest
        });
        document.body.appendChild(element);

        // enter sample text in inputbox
        let radioEl = element.shadowRoot.querySelector('lightning-radio-group');
        radioEl.dispatchEvent(new CustomEvent('change', {detail: {value: 'option2'}}));

        return Promise.resolve()
        .then(() => {
            // Verify displayed value
            const div = element.shadowRoot.querySelector('p');
            expect(div.textContent).toBe('Selected Value Is: option2');
        });
    });
});