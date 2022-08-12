//https://github.com/swdcworld/Salesforce
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