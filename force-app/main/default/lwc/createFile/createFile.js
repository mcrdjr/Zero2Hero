import { LightningElement, track, api } from 'lwc';
import readjson from '@salesforce/apex/JSON2Excel.readjson'; 
import fetchDocs from '@salesforce/apex/JSON2Excel.fetchDocs';   
import fetchRecs from '@salesforce/apex/JSON2Excel.fetchRecs';    
import { NavigationMixin } from 'lightning/navigation';
//import {refreshApex} from '@salesforce/apex';
//https://github.com/trailheadapps/lwc-recipes/blob/main/force-app/main/default/lwc/ldsDeleteRecord/ldsDeleteRecord.js
//https://salesforce.stackexchange.com/questions/307574/local-development-does-not-show-record/307575
//https://jdspaceit.wordpress.com/2019/02/27/wired-property-from-an-apex-method/
//https://salesforce.stackexchange.com/questions/252699/when-do-wire-methods-run-lwc


const columns = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Status',
        fieldName: 'npsp__Status__c',
        type: 'text'
    },
    {
        label: 'Any Data for Document?',
        fieldName: 'anydata',
        type: 'text'
    },
    {
        label: 'Document',
        fieldName: 'DocId__c',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Name' }, 
        target: '_blank'},
    },
];

const columnsD = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Doc Id',
        fieldName: 'Id',
    },
];

let docsMap = new Map();
let recsMap = new Map();

//var refresh = function() {
//    alert('refresh');
//}

export default class CreateFile extends NavigationMixin( LightningElement ) {

    /* constructor() {
        super();
        //console.log('In Constructor...');
        //console.log(this.listDocs);
        
        // attempting anything as below will throw error
        //console.log(JSON.stringify(this.myContacts.data));
    } */

    @api pelem= false;
    @api lcard= 1;
    @api lcardjson = 1;

    name1= 'DI-001302'; //was @api
    @api fname1='JSON';

    @track listDocs;
    @track listRecs;

    @track columns = columns;
    @track columnsD = columnsD;

    @api title = 'Batches and Links to Excel Files';
    @api titleD = 'Docs'; 


    connectedCallback() {
        this.handlerefresh();

        fetchDocs()
        .then(result => {
            result.forEach((row) => {
                let rowData = {};
                rowData.Name = row.Name;
                rowData.Id = row.Id;
                docsMap.set(row.Name, row.Id);    
            })
            fetchRecs()
            .then(result2 => {
                let currentData = [];
                result2.forEach((row) => {
                    let rowData = {};
                    rowData.Id = row.Id;
                    rowData.Name = row.Name;
                    rowData.npsp__Status__c = row.npsp__Status__c;
                    let anydata = row.npsp__Additional_Object_JSON__c === undefined ? 'No Data' : 'Data Exists' ;
                    rowData.anydata = anydata;
                    //rowData.Name2 = '/lightning/r/Campaign/' + row.Id + '/view' ;  //row.Name;
                    //https://sleekdev-dev-ed--c.documentforce.com/servlet/servlet.FileDownload?file=0155Y000004vQXl
                    rowData.DocId__c = docsMap.get(row.Name.trim()) === undefined ? '' : '/servlet/servlet.FileDownload?file=' + docsMap.get(row.Name.trim());
                    //console.log(docsMap.get(row.Name) == undefined ? '' : '/servlet/servlet.FileDownload?file=' + docsMap.get(row.Name));
                    recsMap.set(row.Name, row.Id, row.npsp__Status__c, rowData.anydata,  rowData.DocId__c);  
                    currentData.push(rowData);
                    //console.log('1:' , rowData);
                });
                this.listRecs = currentData;
            })
            .catch(error => {
                console.log(error)
            });
        })
        .catch(error => {
            console.log(error)
        });

    }


/*
    //listDocs
    @track dataDocs
    @wire(fetchDocs, {strvalue: 'data'})
    wiredDocs({error, data}){
        if ( data ) {  
            //this.dataDocs = data;
            //console.log('wire:' + data);
            //this.listDocs = data;
            data.forEach((row) => {
                let rowData = {};
                rowData.Name = row.Name;
                rowData.Id = row.Id;
                docsMap.set(row.Name, row.Id);    
                console.log('Doc Id: ' + row.Name, row.Id)
            })
            console.log('Docs Records:' + data.length);

            //console.log('docsMap' + docsMap);
            //https://salesforce.stackexchange.com/questions/346533/access-map-data-in-lwc-without-using-a-for-each
        } else if ( !data ) {
            console.log('No Data:');
        }    
    } 
*/ 

    renderedCallback() {
        //console.log('renderedCallback')
        /*
        if (docsMap.size > 0) {
            console.log('3 Docs Records from renderedCallback:' + docsMap.size);
        }
        if (recsMap.size > 0) {
            console.log('3 Recs Records from renderedCallback:' + recsMap.size);
        }
        if (docsMap.size > 0 && recsMap.size > 0) {
            console.log('4 Docs Records from renderedCallback:' + docsMap.size);
            console.log('4 Recs Records from renderedCallback:' + recsMap.size);
        }
        */
    }

    get jsonData() {
        //console.log('In jsonData...');
        //console.log(this.dataDocs);
        //return JSON.stringify(this.listDocs);
        return true;
    }

    handleCreateFile() {
        //alert('handleCreateFile');
        readjson({name: this.name1, fname: this.fname1})
                .then(result => {
                    console.log(result);
                })
                .catch(error => {
                    console.log(error);
                    //this.error = error;
                });
                //alert('Done')
    }

    /*
    listRecs; 
    @track dataRecs
    @wire(fetchRecs, {strvalue: 'data'}) 
    wiredRecs( { error, data } ) {
        if ( data ) {
            this.dataRecs = data;
            //console.log('jsonData:' +JSON.stringify(this.listDocs));
            console.log('docsMap from wire :' + docsMap.size);
            let currentData = [];
            data.forEach((row) => {
                let rowData = {};
                rowData.Id = row.Id;
                rowData.Name = row.Name;
                rowData.npsp__Status__c = row.npsp__Status__c;
                //rowData.Name2 = '/lightning/r/Campaign/' + row.Id + '/view' ;  //row.Name;
                //https://sleekdev-dev-ed--c.documentforce.com/servlet/servlet.FileDownload?file=0155Y000004vQXl

                rowData.DocId__c = docsMap.get(row.Name.trim()) == undefined ? '' : '/servlet/servlet.FileDownload?file=' + docsMap.get(row.Name.trim());
                //console.log(docsMap.get(row.Name) == undefined ? '' : '/servlet/servlet.FileDownload?file=' + docsMap.get(row.Name));
                currentData.push(rowData);
                if (rowData.DocId__c != undefined){
                    console.log('rowData:' + docsMap.get(row.Name.trim()) + ':' + row.Name);
                }
            });
            //console.log('DI Records:' + currentData.length);
            this.listRecs = currentData;
            //this.error = undefined;
            //this.initialListRecs = data;
        } else if ( !data ) {
            //console.log('No Data fetchRecs:');
            //this.listRecs = null;
            //this.initialListRecs = null;
            //this.error = error;
        } 
    } 
    */
    
    handleRowAction(event) {
        console.log(event)
        this.handlerefresh();
        //alert('handleRowAction' + event);
    }
    handleRowSelected(event){
        let selectedRows = event.detail.selectedRows;
        let recordIds=[];
        let name=[];
        //console.log(selectedRows.length);

        if(selectedRows.length === 1 ) {
            for(let i =0 ; i< selectedRows.length; i++) {
                recordIds.push(selectedRows[i].Id);
                //this.recordId =[...recordIds];
                name.push(selectedRows[i].Name);
                this.name1 = [...name].toString();
                //alert([...name] + ':' + [...recordIds]);
                //alert(this.name1);

                readjson({name: this.name1, fname: this.fname1})
                .then(result => {
                    console.log(result);
                    this.handlerefresh();
                })
                .catch(error => {
                    //console.log(error);
                    this.error = error;
                });
            }

            //refreshApex(this.getfetchDocs);
            //refreshApex(this.getfetchRecs); 
            //refresh()

            //this.handlerefresh();

            //alert('Done..');
        } else {
            this.template.querySelector('lightning-datatable').selectedRows = [];
        }    
    }

    handlerefresh(){
        //console.log('refreshApex')
        this.listRecs = undefined
        this.listDocs = undefined
        docsMap.clear()
        recsMap.clear()
        //console.log(docsMap)
        //console.log(recsMap)
        //console.log(this.listRecs)
        //console.log(this.listDocs)

        fetchDocs()
        .then(result => {
            result.forEach((row) => {
                let rowData = {};
                rowData.Name = row.Name;
                rowData.Id = row.Id;
                docsMap.set(row.Name, row.Id);    
                //console.log('Doc Id: ' + row.Name, row.Id)
            })
            fetchRecs()
            .then(result2 => {
                let currentData = [];
                result2.forEach((row) => {
                    let rowData = {};
                    rowData.Id = row.Id;
                    rowData.Name = row.Name;
                    rowData.npsp__Status__c = row.npsp__Status__c;
                    let anydata = row.npsp__Additional_Object_JSON__c === undefined ? 'No Data' : 'Data Exists' ;
                    rowData.anydata = anydata;
                    rowData.DocId__c = docsMap.get(row.Name.trim()) === undefined ? '' : '/servlet/servlet.FileDownload?file=' + docsMap.get(row.Name.trim());
                    recsMap.set(row.Name, row.Id, row.npsp__Status__c, rowData.anydata, rowData.DocId__c);  
                    currentData.push(rowData);
                    //console.log('2:' , rowData);
                });
                this.listRecs = currentData;
            })
            .catch(error => {
                console.log(error)
            });
        })
        .catch(error => {
            console.log(error)
        });
    }
}