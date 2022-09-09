import { LightningElement } from 'lwc';

export default class GrandChild extends LightningElement {
    renderedCallback() {
        if (!this.guid) {
            this.guid = this.template.querySelector('.main').getAttribute('id');
            this.dispatchEvent(
                new CustomEvent('itemregister', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        callbacks: {
                            dynamicData: this.dynamicData
                        },
                        template: this.template,
                        guid: this.guid,
                        name: 'c-grand-child'
                    }
                })
            );
        }
    }
    dynamicData = (data) => {
        this.template.querySelector('.dynamic').innerText = data;
    }
}