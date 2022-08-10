//https://salesforce.stackexchange.com/questions/276144/how-to-access-data-from-wire-service-on-component-load
import { LightningElement, api, track, wire } from 'lwc';
import getContacts from "@salesforce/apex/acc.getContacts";
export default class Accon extends LightningElement {

@track cids =[];
@track tempids =[];
@api recordId;

@wire(getContacts, { recordId : "$recordId"})
wiredContacts({ error, data}) {
    if (data) {
        this.cids = data;   
        this.dependentMethod(this.cids);
        console.log('wire:' , this.cids); 
    } else if (error) {
        console.error(error);
    }
}

dependentMethod(currData) {
    console.log('currData => ', JSON.stringify(currData));
    this.tempids = currData;
    // console.log('this.objcurr => ', JSON.stringify(this.objcurr));
}

connectedCallback() {
    try {
        //this.tempids = this.cids;
    } catch (e) {
        console.log('error:' , e)
    }
    console.log('CB:' , this.tempids);
}
}