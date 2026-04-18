import Common "common";

module {
  public type GuideSpecialization = {
    #heritage;
    #nature;
    #adventure;
    #general;
  };

  public type Guide = {
    id : Common.EntityId;
    name : Text;
    specialization : GuideSpecialization;
    bio : Text;
    languagesSpoken : [Text];
    phoneNumber : Text;
    ratePerDay : Nat;
    experienceYears : Nat;
    imageUrl : Text;
    isAvailable : Bool;
    createdAt : Common.Timestamp;
  };

  public type CreateGuideInput = {
    name : Text;
    specialization : GuideSpecialization;
    bio : Text;
    languagesSpoken : [Text];
    phoneNumber : Text;
    ratePerDay : Nat;
    experienceYears : Nat;
    imageUrl : Text;
    isAvailable : Bool;
  };

  public type UpdateGuideInput = {
    id : Common.EntityId;
    name : Text;
    specialization : GuideSpecialization;
    bio : Text;
    languagesSpoken : [Text];
    phoneNumber : Text;
    ratePerDay : Nat;
    experienceYears : Nat;
    imageUrl : Text;
    isAvailable : Bool;
  };
};
