import { LightningElement } from 'lwc';
import lightningConfirm from 'lightning/confirm'
export default class LightningConfirmDemo extends LightningElement {

    async confirmHandler(){
        const result = await lightningConfirm.open({
            message:"Would you like to refresh the page",
            label:"Are you sure?",
            //variant:"headerless", //hide header
            theme:"Success" //success = green warning orange, error red , info grey
            })
            console.log(result)
            //ok = true / cancel = false
            if(result){
                location.reload()
            }
        }   
    }