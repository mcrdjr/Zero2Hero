//https://salesforce.stackexchange.com/questions/276144/how-to-access-data-from-wire-service-on-component-load
//https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.create_components_dom_work
//https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.get_started_lwc
//https://developer.salesforce.com/docs/component-library/bundle/lightning-combobox/example

//https://www.youtube.com/watch?v=T7OGDMRnjT4

import { LightningElement, api, track, wire } from 'lwc';
import getContacts from "@salesforce/apex/acc.getContacts";
export default class Accon extends LightningElement {

    //constructor() {
    //    super();
    //    this.attachShadow({ mode: "open" });
    //
    //}
@track cids =[];
@track tempids =[];
@api recordId;

@wire(getContacts, { recordId : "$recordId"})
wiredContacts({ error, data}) {
    if (data) {
        this.cids = data;   
        this.dependentMethod(this.cids);
        console.log('wire:' , this.cids); 

        //const el = this.template.querySelector('div');
        //console.log('el:', el);
        //const shadowRoot = el.attachShadow({mode: 'open'});
        //shadowRoot.innerHTML = "<h1>I belong to <span>Shadow DOM</span></h1>";
        //el.innerText ="Hi";

    } else if (error) {
        console.error(error);
    }
}


dependentMethod(currData) {
    console.log('currData => ', JSON.stringify(currData));
    this.tempids = currData;
    console.log('after Currdata:',JSON.stringify(this.tempids));
}

connectedCallback() {
    console.log('CB:' , this.tempids);
}

renderedCallback() {
    console.log('RB:' , this.tempids);  
    console.log('h1-1:', this.template.querySelector('h1')); 
    const el = this.template.querySelector('h1');
    console.log('h1-2:', el);

    this.template.querySelector('div'); // <div>First</div>
    this.template.querySelector('span'); // null
    this.template.querySelectorAll('div'); // [<div>First</div>, <div>Second</div>]
}


}