/*
* @author Michael Rucker -  
* @date 08/04/2020
* @description - LWC Component to Display Opps with Annual Fund
*/
import { LightningElement, track, api, wire } from 'lwc';
import getAFOpps from '@salesforce/apex/lwcClasses.getAFOpps';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const fields = [
    'Account.Name',
    'Account.Id'
];

const columns = [
    {
        label: 'Opp Name',
        fieldName: 'Name2',
        typeAttributes: {label: { fieldName: 'OppName' }, 
        target: '_blank'},
        type: 'url',
        hideDefaultActions: 'true'
    },
    {
        label: 'Close Date',
        fieldName: 'CloseDate',
        type: 'text',
        hideDefaultActions: 'true'
    },
    {
        label: 'Stage',
        fieldName: 'StageName',
        type: 'text',
        hideDefaultActions: 'true'
    },
    {
        label: 'Amount',
        fieldName: 'Amount',
        type: 'currency',
        hideDefaultActions: 'true'
    },
    {
        label: 'AF Name',
        fieldName: 'AFName2',
        typeAttributes: {label: { fieldName: 'AFName' }, 
        target: '_blank'},
        type: 'url',
        hideDefaultActions: 'true'
    },
];

export default class ASLQSS4P_AccGiving extends LightningElement {
    @api recordId;
    @track acct;

    @track data = [];
    @track columns = columns;
    @api selRow;
    @api ownerid;

    @wire(getRecord, {recordId: '$recordId', fields})
    acct;

    refreshTable;
    @wire(getAFOpps, {recordId: '$recordId'})
    opp({error, data}) {
        this.refreshTable = data;
        if(data) {
            let currentData = [];
            
            data.forEach((row) => {
                let rowData = {};
                rowData.npsp__Opportunity__c = row.npsp__Opportunity__c;
                rowData.Name2 = '/lightning/r/Opportunity/' + row.npsp__Opportunity__c + '/view' ;  
                rowData.OppName = row.npsp__Opportunity__r.Name;
                rowData.CloseDate = row.npsp__Opportunity__r.CloseDate;
                rowData.StageName = row.npsp__Opportunity__r.StageName;
                rowData.Amount = row.npsp__Opportunity__r.Amount;
                rowData.AFName = row.Name;
                rowData.AFName2 = '/lightning/r/npsp__Allocation__c/' + row.Id + '/view' ; 
                currentData.push(rowData);
            });
            this.oppsize = currentData.length;
            this.data = currentData;
            this.error = undefined;
            
        }
        else if(error) {
            /*
            const evt = new ShowToastEvent({
                title: 'ERROR',
                message: error,
                variant: 'info',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            */
            this.error = error;
        }
    }

}