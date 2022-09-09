//https://www.sfdcpoint.com/salesforce/lightning-web-component-lightning-datatable/
//https://www.salesforcecodecrack.com/2019/07/lightning-datatable-with-row-actions-in.html

//https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.data_table_inline_edit
//https://www.linkedin.com/pulse/inline-editsave-field-refresh-component-after-successful-vijay-kumar/?trk=pulse-article_more-articles_related-content-c/cssParentDemo


//use this one
//https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.data_table_inline_edit

//custom picklist list for inline edit
//https://www.youtube.com/watch?v=YduU57vdWU8

//https://salesforce.stackexchange.com/questions/336819/refresh-apex-in-lwc-not-working

//child to parent - very interesting
//https://salesforcediaries.com/2019/07/24/lwc-communication-part-1-passing-data-from-parent-to-child-component/

//https://salesforcediaries.com/2019/07/24/lwc-communication-part-1-passing-data-from-parent-to-child-component/

import { LightningElement, track, wire, api} from 'lwc';
import getUploadedFiles from '@salesforce/apex/EFLHPAEventUploadFiles.getUploadedFiles';
import deleteUploadedFile from '@salesforce/apex/EFLHPAEventUploadFiles.deleteUploadedFile';
import getParentIds from "@salesforce/apex/EFLHPAEventUploadFiles.getParentIds";
import getEventTypes from "@salesforce/apex/EFLHPAEventUploadFiles.getEventTypes";

import {refreshApex} from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

//row actions
const actions = [
//    { label: 'Edit', name: 'edit'}, 
    { label: 'Delete', name: 'delete'}
];

const COLS = [{
    label: 'Name',
    fieldName: 'Name',
    type: 'text',
    sortable: true
},
{
    label: 'Description',
    fieldName: 'Description__c',
    type: 'text',
    editable: true,
    sortable: true
},
{
    label: 'File Type',
    fieldName: 'File_Type__c',
    type: 'text',
    editable: true,
    sortable: true
},
{
    label: 'ParentId',
    fieldName: 'ParentId__c',
    type: 'text',
    sortable: true
},
{
    label: 'Owner Name',
    fieldName: 'OwnerName__c',
    type: 'text',
    sortable: true
},
{
    type: 'action',
    typeAttributes: {
        rowActions: actions,
        menuAlignment: 'right'
    }
}


];
export default class FileList extends LightningElement {
//Id, Name, File_Type__c, Account__c, Description__c, ParentId__c

@api getIdFromParent;
@api getObjectApiName;

@api recordId;

columns = COLS;
@track error;
@track ufList ;
draftValues = [];

@track tempIds;
@track parentIds = [];
@track objectValue = "None";
@track items = [];

@api objectName = this.getObjectApiName; //"HPA_Event__c";


//List<Id> parentIds = New List<Id>();
//parentIds.add('a058Y000015pYaFQAU');
//parentIds.add('a068Y00001RF5xnQAD');
//parentIds.add('a028Y00001C4RbTQAV');
//list<Uploaded_Files__c> uf = New List<Uploaded_Files__c>();
//uf = [SELECT Id, Name, File_Type__c, Account__c, Description__c, ParentId__c, OwnerName__c FROM Uploaded_Files__c
//            where ParentId__c =:parentIds];
//system.debug(uf);


refreshTable;
@wire(getUploadedFiles, { parentIds: "$parentIds" })
wiredUploadedFiles(value) {
    this.refreshTable = value;
    if (value.data) {
        this.ufList = value.data;
        //console.log(JSON.stringify(this.ufList));
    } else if (value.error) {
        this.error = value.error;
    }
}


@wire(getEventTypes, { objectValue: "$objectValue" })
wiredEventTypes({ error, data }) {
  if (data) {
    this.items = [];
    for (let i = 0; i < data.length; i++) {
      this.items = [
        ...this.items,
        { value: data[i].Value__c, label: data[i].Value__c }
      ];
    }
    if (!this.items.includes("Other")) {
      this.items.push({ value: "Other", label: "Other" });
    }

    this.error = undefined;
  } else if (error) {
    this.error = error;
    this.items = undefined;
  }
}


handleRowActions(event) {
    let actionName = event.detail.action.name;

    console.log('actionName ====> ' , actionName);

    let row = event.detail.row;

    console.log('row ====> ' , row);
    switch (actionName) {
        case 'edit':
            this.editCurrentRecord(row);
            break;
        case 'delete':
            this.deleteUploadedFile(row);
            break;
        default:
            break;
    }
}


editCurrentRecord(currentRow) {
    // open modal box
    //this.bShowModal = true;
    //this.isEditForm = true;

    // assign record id to the record edit form
    //this.currentRecordId = currentRow.Id;
    console.log('edit row', currentRow.Id);
}

deleteUploadedFile(currentRow) {
    console.log('delete row', currentRow.Id);
    
    let currentRecord = [];
    currentRecord.push(currentRow.Id);
    //this.showLoadingSpinner = true;

    // calling apex class method to delete the selected contact
    deleteUploadedFile({lstConIds: currentRecord})
    .then(result => {
        window.console.log('result ====> ' + result);
        //this.showLoadingSpinner = false;

        // showing success message
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: currentRow.Name +' File deleted.',
            variant: 'success'
        }),);

        // refreshing table data using refresh apex
        refreshApex(this.refreshTable);

    })
    .catch(error => {
        window.console.log('Error ====> '+error);
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error!!', 
            message: error.message, 
            variant: 'error'
        }),);
    });

}


//
async handleSave(event) {
    // Convert datatable draft values into record objects
    const records = event.detail.draftValues.slice().map((draftValue) => {
        const fields = Object.assign({}, draftValue);
        return { fields };
    });

    // Clear all datatable draft values
    this.draftValues = [];

    try {
        // Update all records in parallel thanks to the UI API
        const recordUpdatePromises = records.map((record) =>
            updateRecord(record)
        );
        await Promise.all(recordUpdatePromises);

        // Report success with a toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Files updated',
                variant: 'success'
            })
        );

        // Display fresh data in the datatable
        await refreshApex(this.refreshTable);
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error updating or reloading Files',
                message: error.body.message,
                variant: 'error'
            })
        );
    }
}
// 


//
async connectedCallback() {
    console.log('connectedCallback');
    this.tempIds = await getParentIds({ aId: this.getIdFromParent });
    this.parentIds = JSON.stringify(this.tempIds);
    console.log("parentIds:", this.parentIds);
    console.log("typeof:", typeof this.parentIds);
    switch (String(this.getObjectApiName)) {
      case "HPA_Event__c":
        this.objectValue = "HPA Event";
        break;
      case "Event_Inspection__c":
        this.objectValue = "HPA Inspection";
        break;
      case "Violation__c":
        this.objectValue = "HPA Violation";
        break;
      default:
        this.objectValue = "None";
    }
    return this.parentIds;
  }



//

}