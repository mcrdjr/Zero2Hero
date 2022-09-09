import { LightningElement, api } from "lwc";
 
export default class ParentComponent extends LightningElement {
  @api recordId;
  @api objectApiName;
}