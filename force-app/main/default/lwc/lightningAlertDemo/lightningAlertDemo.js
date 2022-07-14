import { LightningElement } from 'lwc';

import LightningAlert from 'lightning/alert'

export default class LightningAlertDemo extends LightningElement {


    async alertHandlerA(event){
        //old way of alert
        //window.alert("Old Alert Hello");

        const { name } = event.target

        await LightningAlert.open({
            message:"This is an Alert message",
            label:`I am ${name} Alert Header`,
            theme:name
        })

        let y = 3
        let x = 2
        this.add(x,y)
    }

    alertHandler(event){
        //old way of alert
        //window.alert("Old Alert Hello");

        const { name } = event.target

        LightningAlert.open({
            //variant:"headerless",
            message:"This is an Alert message",
            label:`I am ${name} Alert Header`,
            theme:name
        }).then(result=>{
            console.log("result", result)
            let y = 3
            let x = 2
            this.add(x,y)
        })

    }



    add(a,b){
        console.log(a+b)
    }
}