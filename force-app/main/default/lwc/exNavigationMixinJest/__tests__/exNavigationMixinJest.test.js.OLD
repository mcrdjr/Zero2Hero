import { createElement } from 'lwc';
import exNavigationMixinJest from 'c/exNavigationMixinJest';
import { getNavigateCalledWith } from 'lightning/navigation';

describe('c-ex-navigation-mixin-jest', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('navigates to home page on button clicked', () => {
        const INPUT_PAGENAME = 'home';
        const INPUT_TYPE = 'standard__namedPage';

        // Create initial element
        const element = createElement('c-ex-navigation-mixin-jest', {
            is: exNavigationMixinJest
        });
        document.body.appendChild(element);

        // Select button to simulate user interaction
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();
        const { pageReference } = getNavigateCalledWith();
        // Verify the component under test called the correct navigate event
        expect(pageReference.type).toBe(INPUT_TYPE);
        expect(pageReference.attributes.pageName).toBe(INPUT_PAGENAME);
    });
})