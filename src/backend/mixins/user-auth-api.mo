import Map "mo:core/Map";
import Time "mo:core/Time";
import UserAuthLib "../lib/user-auth";
import AuthPayment "../types/auth-payment";
import Common "../types/common";

mixin (
  usersByUsername : Map.Map<Text, AuthPayment.UserAccount>,
  sessions : Map.Map<Text, AuthPayment.SessionToken>,
  nextUserId : { var value : Common.EntityId },
) {
  public shared ({ caller = _ }) func registerUser(username : Text, password : Text, fullName : Text, mobileNumber : Text, email : Text) : async { #ok : Text; #err : Text } {
    UserAuthLib.registerUser(usersByUsername, nextUserId, username, password, fullName, mobileNumber, email, Time.now());
  };

  public shared ({ caller }) func loginUser(username : Text, password : Text) : async { #ok : AuthPayment.SessionToken; #err : Text } {
    UserAuthLib.loginUser(usersByUsername, sessions, username, password, caller, Time.now());
  };

  public query func validateSession(token : Text) : async { #ok : Text; #err : Text } {
    UserAuthLib.validateSession(sessions, token, Time.now());
  };

  public shared ({ caller = _ }) func logoutUser(token : Text) : async Bool {
    UserAuthLib.logoutUser(sessions, token);
  };
};
