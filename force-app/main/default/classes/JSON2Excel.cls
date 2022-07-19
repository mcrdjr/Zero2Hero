/*
* @author Michael Rucker 
* @date 9/2020
* @description Read npsp__Additional_Object_JSON__c and create CSV file
* use brute force method to read the JSON in record
* tried to use https://json2apex.herokuapp.com/, but the output was not vaild due to the field names in the JSON
* usage: JSON2Excel.readjson('DI-000284', 'JSON');

SELECT Id, Name, CreatedDate, npsp__Account1ImportStatus__c, npsp__Account1Imported__c, npsp__Account1_City__c, npsp__Additional_Object_JSON__c, npsp__DonationImportStatus__c, 
npsp__Donation_Amount__c, npsp__Donation_Date__c, npsp__NPSP_Data_Import_Batch__c, npsp__Status__c FROM npsp__DataImport__c
where createddate > 2021-09-07T00:00:00Z
and npsp__Status__c <> 'Imported'
order by createddate desc

* 
*/
public class JSON2Excel {
    @AuraEnabled(cacheable=false)
    public static List<npsp__DataImport__c> readjson(string name, string fname) {   
        System.Debug('name:' + name);
        System.Debug('fname:' + fname);
        Map<Id, npsp__General_Accounting_Unit__c> mapGAU = New Map<Id, npsp__General_Accounting_Unit__c>();
        List<npsp__General_Accounting_Unit__c> lstGAU = New List<npsp__General_Accounting_Unit__c>();
        lstGAU = [SELECT Id , name from npsp__General_Accounting_Unit__c];
        
        for(npsp__General_Accounting_Unit__c gau : lstGAU){
            mapGAU.put(gau.id, gau); 	   
        }
        
        List<npsp__DataImport__c> lstJsonHeading = New List<npsp__DataImport__c>();
        lstJsonHeading = [SELECT Id, Name,  npsp__Additional_Object_JSON__c FROM npsp__DataImport__c where Name =: name Limit 1]; //DI-000284
        String fileContent = '';
        String strGAU = '';
        for (npsp__DataImport__c di : lstJsonHeading){
            if (di.npsp__Additional_Object_JSON__c > '') {
                Map<String, Object> results = (Map<String, Object>)JSON.deserializeUntyped(di.npsp__Additional_Object_JSON__c);
                String strJSON = results.get('dynamicSourceByObjMappingDevName').toString();
                strJSON = strJSON.replaceAll('\\}','');
                strJSON = strJSON.replaceAll('\\{','');
                
                String strRecord = '';
                List<String> lstAlpha = strJSON.split(',');
                
                For (String strHeadings : lstAlpha){
                    //System.Debug(strHeadings.SubStringBefore('='));
                    strGAU = strHeadings.SubStringBefore('=');
                    //System.Debug('strGAU' + strGAU.trim());
                    strRecord += strHeadings.SubStringBefore('=') + ',' ;
                    if (strGAU.trim() == 'npsp__GAU_Allocation_1_GAU__c') {
                        strRecord += 'npsp__GAU_Allocation_1_GAU__c Description' + ',' ;    
                        //System.Debug('npsp__GAU_Allocation_1_GAU__c Description');
                    }
                }
                
                fileContent = 'Name' + ',' + strRecord.removeEnd(',') + '\n';
            }
        }
        System.Debug('Headings: ' + fileContent);
        
        List<npsp__DataImport__c> lstJson = New List<npsp__DataImport__c>();
        lstJson = [SELECT Id, Name, npsp__Donation_Amount__c, npsp__Additional_Object_JSON__c FROM npsp__DataImport__c where Name =: name ];
        
        for (npsp__DataImport__c di : lstJson){
            if (di.npsp__Additional_Object_JSON__c > '') {
                System.Debug('Name:' + di.Name);
                Map<String, Object> results = (Map<String, Object>)JSON.deserializeUntyped(di.npsp__Additional_Object_JSON__c);
                String strJSON = results.get('dynamicSourceByObjMappingDevName').toString();
                strJSON = strJSON.replaceAll('\\}','');
                strJSON = strJSON.replaceAll('\\{','');
                String strRecord = '';
                List<String> lstAlpha = strJSON.split(',');
                
                For (String strValues : lstAlpha){
                    strRecord += strValues.SubStringAfter('=') + ',' ;
                    string strId = strValues.SubStringAfter('=') ;
                    //System.debug(strId);
                    strGAU = strValues.SubStringBefore('=');
                    if (strGAU.trim() == 'npsp__GAU_Allocation_1_GAU__c') {
                        String strDesc = mapGAU.get(strId).Name;
                        //System.Debug(strDesc);
                        strRecord += strDesc + ',' ;    
                    }
                }
                
                fileContent = fileContent + di.Name + ',' + strRecord.removeEnd(',') + '\n';
            }
            
            System.Debug('fileContent:' + fileContent);
            //need to create a folder or find one to put stuff into
            //SELECT Id, Name, DeveloperName, AccessType, IsReadonly, Type FROM Folder
            //can't create / insert folder via DML
            try 
            {
                //Folder f = new Folder();
                //f.Name = 'JSON Files';
                //f.Accesstype = 'Public';
                //f.IsReadOnly = False;
                //f.Type = 'Document';  
                //insert f;
                
                //List<Folder> folderList = new List<Folder>();
                //folderList.add(new Folder(Name='JSON Files', AccessType='Public', IsReadOnly=False,Type='Document'));
                
                // DML statement
                //Database.SaveResult[] srList = Database.insert(folderList, false);
                
            } catch (Exception e) {
                //system.Debug(e.getMessage());       
            }
            
            try
            { 
                Id docId = [select Id from Document where Name =: di.Name]?.Id;
                if (fileContent > '' && docId == Null) {
                    
                    Id flderID = [SELECT Id FROM Folder where Name =: fname].id;
                    Document d = new Document(); 
                    d.Name = di.Name; 
                    String myContent = fileContent;
                    d.Body = Blob.valueOf(myContent); 
                    d.ContentType = 'text/csv';  //'application/vnd.ms-excel';
                    d.Type = 'csv';
                    d.FolderID= flderID; //'00l2h000000HxUX';
                    insert d;
                }
                
            }
            catch (Exception e) {
                system.Debug(e.getMessage());   
            }
        }
        return lstJson;
    }
    
    @AuraEnabled(cacheable=false)  
    public static List <sObject> fetchRecs(string strvalue) {  //String listValues
        List < npsp__DataImport__c > listRecs = new List < npsp__DataImport__c >();
        String strSOQL = 'SELECT Id, Name, npsp__status__c, npsp__Additional_Object_JSON__c FROM npsp__DataImport__c order by createddate desc limit 100';
        listRecs = Database.query( strSOQL );
        System.Debug('listRecs:' + listRecs.size());
        
        return  listRecs ;
    }  
    
    
    @AuraEnabled(cacheable=false)  
    public static List <sObject>  fetchDocs(string strvalue) {  
        List < npsp__DataImport__c > listRecs = new List < npsp__DataImport__c >();
        String strSOQL = 'SELECT Id, Name, npsp__status__c FROM npsp__DataImport__c order by createddate desc limit 100';
        listRecs = Database.query( strSOQL );
        //System.Debug('listRecs:' + listRecs.size());
        
        Set<String> resultIds = new Set<String>();
        for (npsp__DataImport__c obj: listRecs)  
        {
            resultIds.add(obj.Name);  
        }

        List<Document> docs = New List<Document>();
        docs = [select id, name from Document where name =: resultIds];
        System.debug('Docs:' + docs.size());
        
        //Map<String,Id> docsDI = new Map<String, Id>();
        //for(document di : [select id, name from Document where name =: resultIds]){
        //    docsDI.put(di.Name, di.Id);
        //}
        
        return  docs ;
    }  
}