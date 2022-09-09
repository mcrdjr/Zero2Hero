/* Apex to return Opp Payments to LWC
* 2022-03
* Michael C. Rucker (Sleek)
* 
*/
public class ASL_GetContactOppPayments {
    @AuraEnabled(cacheable=true)
    public static List<npe01__OppPayment__c> getOppPayRelatedToContacts(String conId) {
        system.debug('conId: ' + conId);
        
        //Set<String> consYears = New Set<String>();
        //Set<String> ttlconsYears = New Set<String>();

        List<ASL_StartofConsecutiveYears__mdt > startYear = [SELECT StartYear__c, EndYear__c FROM ASL_StartofConsecutiveYears__mdt Limit 1];
        System.Debug('StartYear:' + StartYear[0].StartYear__c);
        String strStartYear = StartYear[0].StartYear__c;
        
        System.Debug('EndYear:' + StartYear[0].EndYear__c);
        String strEndYear = StartYear[0].EndYear__c;
        
        /*
        List<npe01__OppPayment__c> oppPay = New List<npe01__OppPayment__c>();
        oppPay = [SELECT  id, npe01__Opportunity__c, ASL_Commitment_Date_Fiscal_Year__c
                FROM npe01__OppPayment__c];
        System.Debug('oppPay:' + oppPay);
        System.Debug(oppPay[0].npe01__Opportunity__c);
        List<Opportunity> op = New List<Opportunity>();
        op = [select id, AccountId, npsp__Primary_Contact__c from Opportunity where Id =: oppPay[0].npe01__Opportunity__c];
        System.Debug(op[0].npsp__Primary_Contact__c);
        string cid = op[0].npsp__Primary_Contact__c;
        */
        
        //system.debug(JSON.serialize(oppPay)); 
        //system.debug(JSON.serializePretty(oppPay)); 
        
        return [SELECT  ASL_Commitment_Date_Fiscal_Year__c
                FROM npe01__OppPayment__c where npe01__Opportunity__r.npsp__Primary_Contact__c = :conId and ASL_Commitment_Date_Fiscal_Year__c > '' 
                and (ASL_Commitment_Date_Fiscal_Year__c >= : strEndYear and ASL_Commitment_Date_Fiscal_Year__c <= : strStartYear)
                order by ASL_Commitment_Date_Fiscal_Year__c desc];
    }
}