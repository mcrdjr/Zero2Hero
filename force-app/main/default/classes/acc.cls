public with sharing class acc {
    @AuraEnabled (cacheable=true)
    public static list<Id> getContacts(String  recordId) {
        List<Id> conid = New List<Id>();

        List<Contact> lstContact = New List<Contact>();
        lstContact = [select id from contact];
        for (Contact c : lstContact){
            conid.add(c.Id);
        }
        system.debug(conid);
        return conid;
    }
}
