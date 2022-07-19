/* 
* @author Michael Rucker
* @date 08/09/2020
* @description Test lwcClasses for LWC components
*/
@isTest
public class lwcClassesTest {
    @isTest
    public static void getOppCamTest(){
        
        ProcessBuilderKillSwitch__c settings = new ProcessBuilderKillSwitch__c(setupownerid=UserInfo.getOrganizationId(),
                                                                               AllowOppProcessBuilder__c  = False);
        insert settings;
        
        Account a = new Account();
        a.Name = 'test';
        insert a;
        //System.Debug('Insert Account:' + a);
        
        Contact co = new Contact();
        co.lastname = 'Test';
        insert co;
        //System.Debug('Insert Contact:' + co);
        
        Campaign c = new Campaign();
        c.Name = 'test';
        insert c;
        //System.Debug('Insert Campaign:' + c);
        
        CampaignMember cm = new CampaignMember();
        cm.CampaignId = c.Id;
        cm.ContactId = co.Id;
        insert cm;
        //System.Debug('Insert CampaignMember:' + cm);
        
        Opportunity o = new Opportunity();
        o.name = 'Test';
        o.CampaignId = c.Id;
        o.AccountId = a.id;
        o.npsp__Primary_Contact__c = co.Id;
        o.StageName = 'Qualification';
        o.CloseDate = Date.newInstance(2020, 8, 7);
        insert o;
        //System.Debug('Insert Opportunity:' + o);
        
        //insert disqualified opp
        Opportunity o1 = new Opportunity();
        o1.name = 'Test2';
        o1.CampaignId = c.Id;
        o1.AccountId = a.id;
        o1.npsp__Primary_Contact__c = co.Id;
        o1.StageName = 'Qualification';
        o1.CloseDate = Date.newInstance(2020, 8, 7);
        o1.ASL_Reasons_for_Disqualification__c = 'Test';
        insert o1;
        //System.Debug('Insert Opportunity:' + o1);
        //
        //need a PA for this to work
        ASL_Prospect_Analysis__c pa = new ASL_Prospect_Analysis__c();
        pa.ASL_Account__c = a.id;
        pa.ASL_Contact__c = co.id;
        
        pa.ASL_Start_Date__c = o1.CloseDate;
        pa.ASL_Status__c = 'Validated';
        pa.ASL_Source__c = 'Development Officer';
        pa.ASL_Type__c = 'Disqualified';
        //pa.ASL_Comment__c = opp.name + '<br>' + '<a href="/lightning/r/Opportunity/' + opp.Id + '/view" target="_blank">' + opp.name + '</a></p>';
        pa.ASL_Comment__c = '<a href="/lightning/r/Opportunity/' + o1.Id + '/view" target="_blank">' + o1.name + '</a></p>';
        pa.ASL_Description__c = '<p>' + o1.ASL_Reasons_for_Disqualification__c + '</p>';
        
        Id prRT = Schema.SObjectType.ASL_Prospect_Analysis__c.getRecordTypeInfosByName().get('Segment').getRecordTypeId();
        pa.RecordTypeId = prRT;
        insert pa;
        
        o1.StageName = 'Disqualified';
        update o1;
        
        List<ASL_Prospect_Analysis__c> delPA = New List<ASL_Prospect_Analysis__c>();
        delPA = [Select Id from ASL_Prospect_Analysis__c];
        Delete delPA;
        
        //insert disqualified opp
        Opportunity o2 = new Opportunity();
        o2.name = 'Test3';
        o2.CampaignId = c.Id;
        o2.AccountId = a.id;
        o2.npsp__Primary_Contact__c = co.Id;
        o2.StageName = 'Disqualified';
        o2.CloseDate = Date.newInstance(2020, 8, 7);
        o2.ASL_Reasons_for_Disqualification__c = 'Test';
        insert o2;
        
        List<Opportunity> camp = [Select CampaignId, OwnerId, AccountId, npsp__Primary_Contact__c from Opportunity where Id =: o.Id  ];
        //System.Debug('Opp List:' + camp);
        
        String strc = o.Id;
        lwcClasses.getOppCam(strc);
        
        lwcClasses.updateOpp(o);     
        
        lwcClasses.fetchOpp(o.Id);   
        
        lwcClasses.getAFOpps(o.Id);
    }
    @isTest
    public static void moreOppTests(){
        
        ProcessBuilderKillSwitch__c settings = new ProcessBuilderKillSwitch__c(setupownerid=UserInfo.getOrganizationId(),
                                                                               AllowOppProcessBuilder__c  = False);
        insert settings;
        
        Account a = new Account();
        a.Name = 'test';
        insert a;
        //System.Debug('Insert Account:' + a);
        
        Contact co = new Contact();
        co.lastname = 'Test';
        insert co;
        //System.Debug('Insert Contact:' + co);
        
        Campaign c = new Campaign();
        c.Name = 'test';
        insert c;
        //System.Debug('Insert Campaign:' + c);
        
        CampaignMember cm = new CampaignMember();
        cm.CampaignId = c.Id;
        cm.ContactId = co.Id;
        insert cm;
        //System.Debug('Insert CampaignMember:' + cm);
        
        Opportunity o = new Opportunity();
        o.name = 'Test';
        o.CampaignId = c.Id;
        o.AccountId = a.id;
        o.npsp__Primary_Contact__c = co.Id;
        o.StageName = 'Qualification';
        o.CloseDate = Date.newInstance(2020, 8, 7);
        insert o;

        o.StageName = 'Disqualified';
        update o;
        
        //List<ASL_Prospect_Analysis__c> delPA = New List<ASL_Prospect_Analysis__c>();
        //delPA = [Select Id from ASL_Prospect_Analysis__c];
        //Delete delPA;
    }
    
}