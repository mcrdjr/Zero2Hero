import { createElement } from "lwc";
import TestComponetwithLwcBuider from "c/testComponetwithLwcBuider";

// import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
// import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

describe("c-test-componetwith-lwc-buider", () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it("has component name on the header", () => {
        const element = createElement("c-test-componetwith-lwc-buider", {
            is: TestComponetwithLwcBuider
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const componentHeader = element.shadowRoot.querySelector("h1");
            expect(componentHeader.textContent).toBe("testComponetwithLwcBuider");
        });
    });
});