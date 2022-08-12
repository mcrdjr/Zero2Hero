import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import IS_GUEST from '@salesforce/user/isGuest';
import UserNameFld from '@salesforce/schema/User.Name';
export default class UserInformation extends LightningElement {

    //other stuff 
    //https://www.w3web.net/lwc-to-get-user-of-logged-details/
    userId = Id;
    isGuest = IS_GUEST;
    fullname;


    currentUserName;
    currentUserEmailId;
    currentIsActive;
    currentUserAlias;
    error;
    //@wire(getRecord, { recordId: userId, fields: [UserNameFld, userEmailFld, userIsActiveFld, userAliasFld ]}) 
    @wire(getRecord, { recordId: Id, fields: [UserNameFld ]}) 
    userDetails({error, data}) {
        if (data) {
            //this.currentUserName = data.fields.Name.value;
            this.fullname = data.fields.Name.value;
            //this.currentUserEmailId = data.fields.Email.value;
            //this.currentIsActive = data.fields.IsActive.value;
            //this.currentUserAlias = data.fields.Alias.value;
        } else if (error) {
            this.error = error ;
        }
    } 


}