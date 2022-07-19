/*
* @author Michael Rucker -  
* @date 07/25/2020
* @description - LWC Component to Display Campaigns on Opp and Update Primary Campaign on Opp
*/

import { LightningElement, api,track, wire} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
 
import getOppCam from '@salesforce/apex/lwcClasses.getOppCam';
import updateOppRecord from '@salesforce/apex/lwcClasses.updateOpp';
import fetchOpp from '@salesforce/apex/lwcClasses.fetchOpp';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const fields = [
    'Opportunity.Name',
    'Opportunity.Id',
    'Opportunity.OwnerId',
    'Opportunity.Owner.FirstName',
    'Opportunity.Owner.LastName',
];
 
//change status to start date
const columns = [
    {
        label: 'Name',
        fieldName: 'Name2',
        typeAttributes: {label: { fieldName: 'Name' }, 
        target: '_blank'},
        type: 'url',
        hideDefaultActions: 'true'
    }, {
        label: 'Type',
        fieldName: 'Type',
        type: 'text',
        hideDefaultActions: 'true'
    }, {
        label: 'Start Date',
        fieldName: 'StartDate',
        type: 'text',
        hideDefaultActions: 'true'
    }
];

export default class oppCampaign extends LightningElement {
    @api recordId;
@track opp;

@track campsize;

@track data = [];
@track columns = columns;

@api selRow;

//@api ownerid;

    @wire(getRecord, {recordId: '$recordId', fields})
    opp;
 
    /*
    get name() {
        return getFieldValue(this.opp.data, 'Opportunity.Name');
    }
 
    get idvalue() {
        return getFieldValue(this.opp.data, 'Opportunity.Id');
    }

    get ownerid() {
        return getFieldValue(this.opp.data, 'Opportunity.OwnerId');
    }

    get fname() {
        return getFieldValue(this.opp.data, 'Opportunity.Owner.FirstName');
    }

    get lname() {
        return getFieldValue(this.opp.data, 'Opportunity.Owner.LastName');
    }
    */
   
    refreshTable;
    @wire(getOppCam, {recordId: '$recordId'})
    camp({error, data}) {
        this.refreshTable = data;
        if(data) {
            let currentData = [];
            data.forEach((row) => {
                let rowData = {};
                rowData.Id = row.Id;
                rowData.Name = row.Name;
                rowData.Name2 = '/lightning/r/Campaign/' + row.Id + '/view' ;  //row.Name;
                rowData.Type = row.Type;
                rowData.StartDate = row.StartDate;
                currentData.push(rowData);
            });
            this.campsize = currentData.length;
            this.data = currentData;
            this.error = undefined;
        }
        else if(error) {
            this.error = error;
        }
    }


    oppRecord;
    @wire (fetchOpp, {recordId: '$recordId'})
    oppt({error, data}){
        if(data){
            this.oppRecord = JSON.stringify(data);
        }
    }

    handleRowSelected(event){

        let selectedRows = event.detail.selectedRows;
        let recordIds=[];

        if(selectedRows.length == 1 && selectedRows.length != this.campsize) {
            for(var i =0 ; i< selectedRows.length; i++) {
                recordIds.push(selectedRows[i].Id);

                //str.substr(22, 18);
                //Change Toast to this
                //Primary Campaign Source Updated
                const evt = new ShowToastEvent({
                    title: 'Primary Campaign Source',
                    //message: 'ID:' + selectedRows.length + ':' + selectedRows[i].Name2.substr(22,18),
                    message: 'Primary Campaign Source Updated',
                    variant: 'info',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);

                let opp = JSON.parse(this.oppRecord);
                opp.CampaignId = selectedRows[i].Name2.substr(22,18);

                updateOppRecord({recordForUpdate: opp})
                .then(result => {
                    this.wiredOpp = result;
                    console.log(result);
                    refreshApex(this.opp);
                    this.template.querySelector('lightning-datatable').selectedRows = [];

                    refreshApex(this.refreshTable);
                })
                .catch(error => {
                    this.error = error;
                });
            }
        } else {
            this.template.querySelector('lightning-datatable').selectedRows = [];
        }
    }
}