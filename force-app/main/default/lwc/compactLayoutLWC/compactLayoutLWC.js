import { LightningElement, api , track, wire } from 'lwc';

import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ACTIVE__C from '@salesforce/schema/Account.Active__c';
import TEST_FIELD__c from '@salesforce/schema/Account.Financial_Gift_Capacity_Rating__c';
import ID_FIELD from '@salesforce/schema/Account.Id';

import account from '@salesforce/schema/Account'

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getCounts from '@salesforce/apex/getCounts.getAccountContacts';
import getCountsPA from '@salesforce/apex/getCountsPA.getAccountContacts';
import donothing from '@salesforce/apex/donothing.one';
const FIELDS = ['Account.Name', 'Account.Id'];

export default class CompactLayoutLWC extends NavigationMixin(LightningElement) {

        @api recordId;
        @api objectApiName;

        name = '';
        idvalue = '';
        fields;
        account;

        fields1 = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD,ACTIVE__C, TEST_FIELD__c, ID_FIELD];

        intCC;
        intCC1;
        intCC2;

        intPA;
        intPA1;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    @api intCCdata;
    @wire(getCounts, ({ recordId: '$idvalue' }) )  //'this.idvalue'
    getCC(value) {
        this.intCCdata = value;
        const { data, error } = value; // destructure the provisioned value
        if (data) { 
            this.intCC = JSON.parse(JSON.stringify(data)); 
            this.intCC1 = this.intCC[0].cntC;
            this.intCC2 = this.intCC[0].slsC;
         }
        else if (error) {  }
    }

    @api intPAdata;
    @wire(getCountsPA, ({ recordId: '$idvalue' }) )  //'this.idvalue'
    getPA(value) {
        this.intPAdata = value;
        const { data, error } = value; // destructure the provisioned value
        if (data) { 
            this.intPA = JSON.parse(JSON.stringify(data)); 
            this.intPA1 = this.intPA[0].cntC;
         }
        else if (error) {  }
    }

    @api nothing1;

    @wire(donothing, ({recordId: '$idvalue'}))
    nothing({error, data}) {
        if(data){
            this.nothing1 = JSON.parse(JSON.stringify(data)); 
            this.connectedCallback1();
        } else if (error) {
            this.nothing = undefined;
            this.error = error;
        }
    }
    

    handleInputFocus() {
        refreshApex(this.account);
    }

    showInfoToast() {
        const evt = new ShowToastEvent({
            title: 'Toast Info',
            message: this.idvalue + ' ' + this.account + ' ' + this.intCCdata + ' ' + this.intPAdata,
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
        refreshApex(this.account);
        refreshApex(this.intCCdata);
        refreshApex(this.intPAdata);
    }

    get intCCField() {
        return this.intCC;  
    }
    get aname() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }

    get idfield() {
        this.idvalue = getFieldValue(this.account.data, ID_FIELD);
        return  '/lightning/r/Account/' + getFieldValue(this.account.data, ID_FIELD) + '/view' ;  
    }

    handleClick(){
        const evt = new ShowToastEvent({
            title: 'Toast Info',
            message: 'Need to figure out how to Open Account Hierarchy Page',
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    @track showStartBtn = true;
    @track timeVal = '0:0:0:0';
    timeIntervalInstance;
    totalMilliseconds = 0;

    connectedCallback1() {
        this.start(this.account, this.intCCdata, this.intPAdata);
      }

      connectedCallback_OLD() {
        const evt = new ShowToastEvent({
            title: 'Toast Info',
            message: this.idvalue + ' ' + this.intCCdata + ' ' + this.intPAdata ,
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
      }

      //https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.apex

    start(event, event1, event2) {
        //this.showStartBtn = false;
        var parentThis = this;

        // Run timer code in every 30000 milliseconds
        this.timeIntervalInstance = setInterval(function() {

            // Time calculations for hours, minutes, seconds and milliseconds
            var hours = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((parentThis.totalMilliseconds % (1000 * 60)) / 1000);
            var milliseconds = Math.floor((parentThis.totalMilliseconds % (1000)));
            
            // Output the result in the timeVal variable
            //parentThis.timeVal = hours + ":" + minutes + ":" + seconds + ":" + milliseconds + ' ' + event + ' ' + event1 + ' ' + event2;   
            parentThis.timeVal = hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
            refreshApex(event);

            refreshApex(event1);
            refreshApex(event2);
            //refresh1;
            //refresh2;

            parentThis.totalMilliseconds += 15000;
        }, 15000);
    }
}