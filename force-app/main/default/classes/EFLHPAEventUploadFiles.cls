public with sharing class EFLHPAEventUploadFiles {
    @AuraEnabled(cacheable=true)
    public static List<EFL_Dynamic_Picklist__mdt> getEventTypes(
      String objectValue
    ) {
      String picklistkey = objectValue;
  
      return [
        SELECT Value__c, Picklist_Key__c
        FROM EFL_Dynamic_Picklist__mdt
        WHERE Picklist_key__c = : picklistkey
        order by Value__c
      ];
    }
  
    //need to add fields to Event Ispection/Violation master detail 
      @AuraEnabled(cacheable=true)
      public static list<Id> getParentIds(Id aId){
          System.Debug('aId:' + aId);
          List<Id> ids = new List<Id>();
          ids.add(aId);
          for(Violation__c v : [SELECT Id FROM Violation__c WHERE  Event_Inspection__r.HPA_Event__c  = :aId or Event_Inspection__c = :aId ]){
              ids.add(v.Id);
          }
          for(Event_Inspection__c ei : [SELECT Id FROM Event_Inspection__c WHERE HPA_Event__c = :aId]){
              ids.add(ei.Id);
          }
          System.Debug('ids to return:' + ids);
          return ids; 
      }

        @AuraEnabled(cacheable=true)
        public static List<Uploaded_Files__c> getUploadedFiles(List<Id> parentIds) {
          System.Debug('parentIds:' + parentIds);
            return [SELECT Id, Name, File_Type__c, Account__c, Description__c, ParentId__c, OwnerName__c FROM Uploaded_Files__c
            where ParentId__c = :parentIds];
        }

        @AuraEnabled
        public static void deleteUploadedFile(list<Id> lstConIds){
        try {
            list<Uploaded_Files__c> lstConsToDelete = new list<Uploaded_Files__c>();
            System.debug('lstConIds ====> '+lstConIds);
            for(Id idCon : lstConIds) {
                lstConsToDelete.add(new Uploaded_Files__c(Id = idCon));
            }
            if(!lstConsToDelete.isEmpty()) {
                delete lstConsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

  }