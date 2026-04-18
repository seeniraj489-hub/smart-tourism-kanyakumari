import Map "mo:core/Map";
import AuthPayment "../types/auth-payment";
import Common "../types/common";

module {
  // Session expiry: 24 hours in nanoseconds
  let SESSION_EXPIRY_NS : Int = 86_400_000_000_000;

  // Deterministic "hash": HASH:<username>:<password>
  // Not cryptographic — used as a simple content-addressable check.
  public func hashPassword(username : Text, password : Text) : Text {
    "HASH:" # username # ":" # password;
  };

  // Generate a token string from username + current time
  public func generateToken(username : Text, now : Common.Timestamp) : Text {
    "TKN:" # username # ":" # now.toText();
  };

  public func registerUser(
    usersByUsername : Map.Map<Text, AuthPayment.UserAccount>,
    nextId : { var value : Common.EntityId },
    username : Text,
    password : Text,
    fullName : Text,
    mobileNumber : Text,
    email : Text,
    now : Common.Timestamp,
  ) : { #ok : Text; #err : Text } {
    if (username.size() < 3) return #err("Username must be at least 3 characters");
    if (password.size() < 6) return #err("Password must be at least 6 characters");
    if (fullName.size() == 0) return #err("Full name is required");
    if (mobileNumber.size() == 0) return #err("Mobile number is required");
    if (email.size() == 0) return #err("Email is required");
    switch (usersByUsername.get(username)) {
      case (?_) #err("Username already taken");
      case null {
        let id = nextId.value;
        nextId.value += 1;
        let account : AuthPayment.UserAccount = {
          id;
          username;
          passwordHash = hashPassword(username, password);
          fullName;
          mobileNumber;
          email;
          createdAt = now;
        };
        usersByUsername.add(username, account);
        #ok("Registration successful");
      };
    };
  };

  public func loginUser(
    usersByUsername : Map.Map<Text, AuthPayment.UserAccount>,
    sessions : Map.Map<Text, AuthPayment.SessionToken>,
    username : Text,
    password : Text,
    callerPrincipal : Principal,
    now : Common.Timestamp,
  ) : { #ok : AuthPayment.SessionToken; #err : Text } {
    switch (usersByUsername.get(username)) {
      case null #err("Invalid username or password");
      case (?account) {
        if (account.passwordHash != hashPassword(username, password)) {
          return #err("Invalid username or password");
        };
        let token = generateToken(username, now);
        let session : AuthPayment.SessionToken = {
          token;
          userId = callerPrincipal;
          username;
          fullName = account.fullName;
          mobileNumber = account.mobileNumber;
          email = account.email;
          expiresAt = now + SESSION_EXPIRY_NS;
        };
        sessions.add(token, session);
        #ok(session);
      };
    };
  };

  // Query-safe: does NOT mutate state — simply checks expiry without removing
  public func validateSession(
    sessions : Map.Map<Text, AuthPayment.SessionToken>,
    token : Text,
    now : Common.Timestamp,
  ) : { #ok : Text; #err : Text } {
    switch (sessions.get(token)) {
      case null #err("Invalid or expired session");
      case (?session) {
        if (now > session.expiresAt) {
          #err("Session expired");
        } else {
          #ok(session.username);
        };
      };
    };
  };

  public func logoutUser(
    sessions : Map.Map<Text, AuthPayment.SessionToken>,
    token : Text,
  ) : Bool {
    switch (sessions.get(token)) {
      case null false;
      case (?_) {
        sessions.remove(token);
        true;
      };
    };
  };

  public func countUsers(usersByUsername : Map.Map<Text, AuthPayment.UserAccount>) : Nat {
    usersByUsername.size();
  };
};
