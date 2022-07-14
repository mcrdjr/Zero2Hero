//https://salesforcespace.blogspot.com/2020/04/how-to-draw-charts-in-lwc.html
//https://github.com/asagarwal/How-to-Generate-Use-QR-Code-in-Salesforce/blob/master/email-template.txt
//https://github.com/asagarwal
//https://pages.github.com/

import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import ANNUAL_REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class DataEntryForm extends LightningElement {

    imageURL;

    objectName = ACCOUNT_OBJECT ;
    fieldList = [NAME_FIELD, ANNUAL_REVENUE_FIELD, TYPE_FIELD, INDUSTRY_FIELD];

    successHandler(event){
        console.log(event.detail.id);
        //https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://d8y000000ga1ouac-dev-ed.lightning.force.com/lightning/r/Account/0018Y00002lm0ooQAA/view
        //console.log("https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://d8y000000ga1ouac-dev-ed.lightning.force.com/lightning/r/Account/" + event.detail.id + "/view")
        this.imageURL = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://d8y000000ga1ouac-dev-ed.lightning.force.com/lightning/r/Account/" + event.detail.id + "/view";

        const toastEvent = new ShowToastEvent({
            title:"Account created",
            message:"Record ID: " + event.detail.id,
            variant:"success"
        });
        this.dispatchEvent(toastEvent);
     }
}