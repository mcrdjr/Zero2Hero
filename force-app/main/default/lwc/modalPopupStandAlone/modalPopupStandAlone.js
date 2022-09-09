//https://forceblogs.com/create-modal-popup-box-in-lwc-salesforce/
import { LightningElement, track, wire, api } from 'lwc';
import getEventTypes from "@salesforce/apex/EFLHPAEventUploadFiles.getEventTypes";

export default class ModalPopupStandAlone extends LightningElement {
    @api recordId;

    @api objectApiName;
    //@api objectName = this.objectApiName; //"HPA_Event__c";
    @track objectValue = "None";

    @api objectName = this.getObjectApiName;

    @track items = [];
    
    @track showModal = false;
    @track attachmentType = "";

    @wire(getEventTypes, { objectValue: "$objectValue" })
  wiredEventTypes({ error, data }) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.items = [
          ...this.items,
          { value: data[i].Value__c, label: data[i].Value__c }
        ];
      }
      this.items.push({ value: "Other", label: "Other" });

      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.items = undefined;
    }
  }

  connectedCallback() {
    console.log('connectedCallback modalPopup:', String(this.objectApiName));

    switch (String(this.objectApiName)) {
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
  }

  get attachmentTypeOptions() {
    return this.items;
  }

  handleAttachmentTypeChange(event) {
    this.attachmentType = undefined;
    this.attachmentType = event.detail.value;
  }

    openModal() {
        // Setting boolean variable to true, this will show the Modal
        this.showModal = true;
    }

    closeModal() {
        // Setting boolean variable to false, this will hide the Modal
        this.showModal = false;
    }

    saveModal() {
        // Setting boolean variable to false, this will hide the Modal
        this.showModal = false;
        console.log('we will save something here');
    }

}