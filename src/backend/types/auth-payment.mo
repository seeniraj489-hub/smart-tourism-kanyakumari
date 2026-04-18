import Common "common";

module {
  // --- User Auth Types ---
  public type UserAccount = {
    id : Common.EntityId;
    username : Text;
    passwordHash : Text;
    fullName : Text;
    mobileNumber : Text;
    email : Text;
    createdAt : Common.Timestamp;
  };

  public type SessionToken = {
    token : Text;
    userId : Principal;
    username : Text;
    fullName : Text;
    mobileNumber : Text;
    email : Text;
    expiresAt : Common.Timestamp;
  };

  // --- Payment Types ---
  public type PaymentStatus = {
    #pending;
    #completed;
    #failed;
  };
};
