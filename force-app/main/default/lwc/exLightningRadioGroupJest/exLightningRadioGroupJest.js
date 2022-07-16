//https://github.com/swdcworld/Salesforce
//https://developer.salesforce.com/docs/component-library/bundle/lightning-radio-group/specification

//jest issue on install
//https://stackoverflow.com/questions/69880169/error-installing-npm-install-salesforce-sfdx-lwc-jest-save-dev
//https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.unit_testing_using_jest_installation

//npm run test:unit:coverage


import { LightningElement } from 'lwc';

export default class ExLightningRadioGroupJest extends LightningElement {
    value = '';
    selectedValue; 
    
    // Options list to show on page
    get options() {
        return [
            { label: 'Apple', value: 'Option1' },
            { label: 'Banana', value: 'Option2' },
            { label: 'Cherry', value: 'Option3' },
            { label: 'Date', value: 'Option4' },
            { label: 'Elderberry', value: 'Option5' },
        ];
    }

    // On selection get the selected value
    handleClick(event){
      this.selectedValue = event.detail.value;
    }
}