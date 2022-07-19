/*
* @author Michael Rucker -  
* @date 07/25/2020
* @description - Classes for LWC Components
*/
public with sharing class lwcClasses { 
    @AuraEnabled(cacheable=true)
    public static list<Campaign> getOppCam(string recordId) {
        //System.Debug('recordId:' + recordId);
        //find the opp - it will have the campaignId
        //
        List<Opportunity> camp = [Select CampaignId, OwnerId, AccountId, npsp__Primary_Contact__c from Opportunity where Id =: recordId  ];
        //System.Debug('Opp List:' + camp);
        Id campId = camp[0].CampaignId;
        Id ownerId = camp[0].OwnerId;
        Id acctId = camp[0].AccountId;
        Id oppPCId = camp[0].npsp__Primary_Contact__c;
        //System.Debug('Campaign Id:' + campId);
        //System.Debug('OwnerId Id:' + ownerId);
        //System.Debug('Account Id:' + acctId);
        //System.Debug('Opp PC:' + oppPCId);
        
        //need to get Contacts for this Accout
        //and Campaign Members 
        //

        List<Contact> cont = [Select Id, Name from Contact where AccountId =: acctId or Id=: oppPCId];
        //System.Debug('Contacts:' + cont);   
        
        List<CampaignMember> campMembers = [Select CampaignId, ContactId from CampaignMember where ContactId =: cont];
		//System.Debug('Campaign Members:' + campMembers);        

        Set<Id> contCM = New Set<Id>();
        for (CampaignMember cm : campMembers) {
            contCM.add(cm.CampaignId);
        }
        
        //System.Debug('Campaign Member Values:' + campMembers);
        //System.Debug('Campaign Id:' + contCM);
                     
        return [select Id, Name, Type, StartDate from Campaign where Id =: contCM order by StartDate desc NULLS LAST];
        //return [select Id, Name, Type, Status from Campaign where OwnerId =: ownerId order by createddate desc];
    }
    
    @AuraEnabled
    public static object updateOpp(Opportunity recordForUpdate){
        //System.Debug('recordForUpdate:' + recordForUpdate);
        update recordForUpdate;
        return recordForUpdate;
    }
    
    @AuraEnabled(cacheable=true)
    public static Opportunity fetchOpp(string recordId){
        //System.Debug('recordId:' + recordId);
        return [SELECT Id,Name, CampaignId FROM Opportunity where Id=:recordId LIMIT 1];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<npsp__Allocation__c> getAFOpps(string recordId){
        //system.debug('recordId:' + recordId);
        //do we need to get Id's for Annual Fund Records
        //Set<Id> setAf = New Set<Id>();
        //Map<Id, npsp__General_Accounting_Unit__c> lstAf = New Map<Id,npsp__General_Accounting_Unit__c>([SELECT Id FROM npsp__General_Accounting_Unit__c where annual_Fund__c = True]);
        //System.Debug('AF ID:' + lstAf.keySet());
        //
        //lwcclasses.getAFOpps('0012h00000GVKliAAH');
        //get Id's for Opp's for this Account
        Set<Id> setOpp = New Set<Id>();
        Map<Id, Opportunity> mapOpp = New Map<Id,Opportunity>([SELECT Id FROM Opportunity where AccountId=:recordId]);
        //System.Debug('Opp ID:' + mapOpp.keySet());
  		set<Id> oppKeys = mapOpp.keySet();
        
        //get Allocation Records
		List<npsp__Allocation__c> oppAll = New List<npsp__Allocation__c>();
        oppAll = [SELECT npsp__Opportunity__c , Name, npsp__Opportunity__r.Name, npsp__Opportunity__r.CloseDate, npsp__Opportunity__r.Amount, npsp__Opportunity__r.StageName FROM npsp__Allocation__c where ASL_Annual_Fund__c = True and npsp__Opportunity__c  =: oppKeys order by npsp__Opportunity__c];
        return oppAll;
        //return [SELECT Id,Name FROM Opportunity where AccountId=:recordId];
    }
    
}