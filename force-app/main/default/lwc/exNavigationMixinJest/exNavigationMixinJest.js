//https://github.com/swdcworld/Salesforce
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ExNavigationMixinJest extends NavigationMixin(LightningElement) {
    navigateToHome() {
        // Use the built-in 'Navigate' method
        this[NavigationMixin.Navigate]({
            // Pass in pageReference
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            },
        });
    }
}