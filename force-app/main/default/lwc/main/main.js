//https://salesforcesas.home.blog/2019/07/25/lwc-access-templates-and-methods-of-child-components/

import { LightningElement } from 'lwc';

export default class Main extends LightningElement {

    privateChildren = {};
    registerItem(event) {
    event.stopPropagation();
    const item = event.detail;
 
    // create key for each child against its name
    // eslint-disable-next-line no-prototype-builtins
    if (!this.privateChildren.hasOwnProperty(item.name)) this.privateChildren[item.name] = {};
 
    // store each item against its guid
    this.privateChildren[item.name][item.guid] = item;
}
addStyles() {
    Object.values(this.privateChildren['c-grand-child']).forEach((element) => {
        element.template.querySelector('.my-class').style.color = 'white';
        element.template.querySelector('.my-class').style.backgroundColor = 'blue';
    });
}
addData() {
    Object.values(this.privateChildren['c-grand-child']).forEach((element, index) => {
        element.callbacks.dynamicData('Changing dynamic data => ' + index);
    });
}

}