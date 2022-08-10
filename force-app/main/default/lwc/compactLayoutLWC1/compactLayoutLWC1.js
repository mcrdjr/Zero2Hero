import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import {refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

const FIELDS = ['Contact.Name', 'Contact.Phone'];
//https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_record
export default class LoadContact extends LightningElement {
    @api recordId;
    contact;
    error;
    name;
    phone;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
            this.error = error;
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading contact',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            this.contact = data;
            this.name = this.contact.fields.Name.value;
            this.phone = this.contact.fields.Phone.value;

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Loading contact info',
                    message: this.name,
                    variant: 'success',
                }),
            );

        }
    }
}