import { LightningElement } from 'lwc';
import LightningPrompt from 'lightning/prompt'
import LightningAlert from 'lightning/alert'
export default class LightningPromptDemo extends LightningElement {


    promptHandler(){
        LightningPrompt.open({
            message:"Please enter your Age",
            label:"Check Your Age",
            theme:"success", //success, warning, error, info
            defaultValue:30
        }).then(result=>{
            console.log(result)
            if(result && Number(result)>18){
                //console.log("Age Okay")
                this.alertHandler(`Your Age of ${result} is OKAY`,"Success","success")
            } else {
                //console.log("Age NOT okay")
                this.alertHandler(`Age ${result} IS NOT Okay`,"Error","error")
            }
        })
    }

    alertHandler(message, label, theme){
        LightningAlert.open({
            message:message,
            label:label,
            theme:theme
        })
    }
}