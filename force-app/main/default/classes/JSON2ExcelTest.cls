//https://salesforce.stackexchange.com/questions/100690/auto-number-name-shows-up-null-in-the-test-class/100724
//
@isTest
public class JSON2ExcelTest {
    @isTest
    public static void readjson_test() {
        
        npsp__General_Accounting_Unit__c gau = new npsp__General_Accounting_Unit__c();
        gau.Name = 'test';
        insert gau;
        id idgau = [select id from npsp__General_Accounting_Unit__c].id;
        
        npsp__DataImport__c di = new npsp__DataImport__c();
        di.npsp__Additional_Object_JSON__c = '{"name":"npsp__Additional_Object_JSON__c","dynamicSourceByObjMappingDevName":{"GAU_Allocation_1_052cefa66temp2":{"sourceObj":{"attributes":{"type":"npsp__DataImport__c"},"npsp__GAU_Allocation_1_Percent__c":null,"npsp__GAU_Allocation_1_GAU__c":"' + idgau + '","npsp__DonationImported__c":null,"npsp__GAU_Allocation_1_Amount__c":250.0,"npsp__PaymentImported__c":null},"objectMappingTemplateDevName":"GAU_Allocation_1_052cefa66","objectMappingDevName":"GAU_Allocation_1_052cefa66temp2","importedRecordStatus":null,"importedRecordId":null,"fieldMappingSetDevName":"Migrated_Custom_Field_Mapping_Set"},"GAU_Allocation_1_052cefa66temp1":{"sourceObj":{"attributes":{"type":"npsp__DataImport__c"},"npsp__GAU_Allocation_1_Percent__c":null,"npsp__GAU_Allocation_1_GAU__c":"' + idgau + '","npsp__DonationImported__c":null,"npsp__GAU_Allocation_1_Amount__c":250.0,"npsp__PaymentImported__c":null},"objectMappingTemplateDevName":"GAU_Allocation_1_052cefa66","objectMappingDevName":"GAU_Allocation_1_052cefa66temp1","importedRecordStatus":null,"importedRecordId":null,"fieldMappingSetDevName":"Migrated_Custom_Field_Mapping_Set"}}}';
        di.npsp__Status__c = 'Dry Run - Validated';
        insert di;

        string diname = [select Id , Name from npsp__DataImport__c].name;
        //System.Debug(diname);
        //Id flderName = [SELECT Name FROM Folder where name = 'JSON Files'].Name;
        String flderName = [SELECT Name FROM Folder where Type = 'Document' LIMIT 1].Name;
        //System.Debug(flderName);
        JSON2Excel.readjson(diname, flderName);
    }
}