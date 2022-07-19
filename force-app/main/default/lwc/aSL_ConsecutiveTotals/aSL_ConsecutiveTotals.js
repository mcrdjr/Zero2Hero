import { LightningElement, api, track ,wire } from 'lwc';

import ASL_GetContactOppPayments from 
'@salesforce/apex/ASL_GetContactOppPayments.getOppPayRelatedToContacts';

import {refreshApex } from '@salesforce/apex';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import C1 from '@salesforce/schema/Contact.ASL_NumOfFiscalYearsGiven__c';
import C2 from '@salesforce/schema/Contact.ASL_NumOfConsecutiveFiscalYearsGiven__c';
import ID_FIELD from '@salesforce/schema/Contact.Id';

const fields = [
    'Contact.Id',
    'Contact.ASL_NumOfFiscalYearsGiven__c',
    'Contact.ASL_NumOfConsecutiveFiscalYearsGiven__c'
];

export default class ASL_ConsecutiveTotals extends LightningElement {

    @track yearList =[];

    //@track c1 = 0;
    //@track c2 = 0;
    @api recordId;
    @track contacts;
    @track contact;

    //now using ASL_Commitment_Date_Fiscal_Year__c
    //was ASL_Payment_Fiscal_Year__c
    @track columns = [
        { label: 'Fiscal Years', fieldName: 'ASL_Commitment_Date_Fiscal_Year__c', type: 'text' },
    ];

    @wire(getRecord, {recordId: '$recordId', fields})
    contact;

    //console.log('contact:' + contacts);

    @wire(ASL_GetContactOppPayments, {conId: '$recordId'}) 
    WireContactRecords({error, data}){
        if(data){
            this.contacts = data;
            //this.c1 = data.length;
            //this.c2 = data.length;
            this.error = undefined;
            console.log('c1:' + getFieldValue(this.contact.data, C1));
            console.log('c2:' + getFieldValue(this.contact.data, C2));

            const c1 = getFieldValue(this.contact.data, C1);
            const c2 = getFieldValue(this.contact.data, C2);
            //need to figure out the 2 values to update contact with
            //console.log('opp payments:' + JSON.stringify(data));
            //console.log('recordId:' + this.recordId);
            //console.log('contact:' + JSON.stringify(this.contacts.data));
            
            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.recordId;
            //fields[C1.fieldApiName] = data.length; //this.c1;
            //fields[C2.fieldApiName] = data.length; //this.c2;

            const recordInput = { fields };
 
            const NumOfFiscalYearsGiven = new Set();
            const intNumOfFiscalYearsGiven = new Set();
            const NumOfConsecutiveFiscalYearsGiven = new Set(); 
            for(let i=0; i<this.contacts.length; i++){
                //console.log(this.contacts[i].ASL_Commitment_Date_Fiscal_Year__c);
                NumOfFiscalYearsGiven.add(this.contacts[i].ASL_Commitment_Date_Fiscal_Year__c);
                intNumOfFiscalYearsGiven.add(parseInt(this.contacts[i].ASL_Commitment_Date_Fiscal_Year__c));
            }
            console.log('NumOfFiscalYearsGiven:' + NumOfFiscalYearsGiven.size);
            for (let item of intNumOfFiscalYearsGiven) {
                console.log(item);
                this.yearList.push(item);
            }
            //console.log('Highest Year:' + Math.max(...intNumOfFiscalYearsGiven));
            for (let i=0; i<intNumOfFiscalYearsGiven.size - 1; i++){
                //console.log(`set: + ${i}:` + [...intNumOfFiscalYearsGiven][i]);    
                if (([...intNumOfFiscalYearsGiven][i] - [...intNumOfFiscalYearsGiven][i+1]) == 1){
                    console.log(([...intNumOfFiscalYearsGiven][i] + ':' + [...intNumOfFiscalYearsGiven][i+1]))
                    NumOfConsecutiveFiscalYearsGiven.add([...intNumOfFiscalYearsGiven][i]); 
                    NumOfConsecutiveFiscalYearsGiven.add([...intNumOfFiscalYearsGiven][i+1]);  
                    //console.log(`set: + ${i}:` + [...intNumOfFiscalYearsGiven][i]);     
                } else
                {
                    NumOfConsecutiveFiscalYearsGiven.add([...intNumOfFiscalYearsGiven][i]); 
                    break;
                }
            }

            //console.log('NumOfConsecutiveFiscalYearsGiven:' + NumOfConsecutiveFiscalYearsGiven.size);
            //for (let item of NumOfConsecutiveFiscalYearsGiven) {
            //    console.log(item);
            //}

            //console.log('c1:' + getFieldValue(this.contact.data, C1));
            //console.log('c2:' + getFieldValue(this.contact.data, C2));
            var bolUpdate = false;

            //console.log(getFieldValue(this.contact.data, C1) + '-' + NumOfFiscalYearsGiven.size);
            //if (getFieldValue(this.contact.data, C1) != NumOfFiscalYearsGiven.size){
            if (c1 != NumOfFiscalYearsGiven.size){    
                fields[C1.fieldApiName] = NumOfFiscalYearsGiven.size; 
                //this.c1 = NumOfFiscalYearsGiven.size; 
                console.log('C1 updated');
                bolUpdate = true;
            }

            //console.log(getFieldValue(this.contact.data, C2) + '-' + NumOfConsecutiveFiscalYearsGiven.size);
            //if(getFieldValue(this.contact.data, C2) != NumOfConsecutiveFiscalYearsGiven.size){
            if(c2 != NumOfConsecutiveFiscalYearsGiven.size){
                fields[C2.fieldApiName] = NumOfConsecutiveFiscalYearsGiven.size; 
                //this.c2 = NumOfConsecutiveFiscalYearsGiven.size; 
                console.log('C2 updated');
                bolUpdate = true;
            }

            //fields[C1.fieldApiName] = NumOfFiscalYearsGiven.size; 
            //fields[C2.fieldApiName] = NumOfConsecutiveFiscalYearsGiven.size; 
            this.c1 = NumOfFiscalYearsGiven.size; 
            this.c2 = NumOfConsecutiveFiscalYearsGiven.size; 

            //this.contacts = NumOfFiscalYearsGiven;
            console.log(bolUpdate);

            if(bolUpdate == true){
                updateRecord(recordInput)
                    .then(() => {
                        console.log('Update Okay');
                        return refreshApex(this.contact);
                    })
                    .catch(error => {
                    console.log('Error' + error);
                    });
            }
            if(bolUpdate == false){
                console.log('No Update necessary')
            }
        } else {
            this.error = error;
            this.contacts = undefined;
        }
    }
}