//https://www.sfdcpoint.com/salesforce/lightning-web-component-lightning-datatable/
import { LightningElement ,api, wire, track } from 'lwc';
import searchContactList from '@salesforce/apex/LWC_ContactController.searchContactList';

export default class CssChildDemo extends LightningElement {
    @track searchKey = 'Edg';
    @track recId;
     
    @wire(searchContactList, {accountName:'$searchKey'}) contacts;

}