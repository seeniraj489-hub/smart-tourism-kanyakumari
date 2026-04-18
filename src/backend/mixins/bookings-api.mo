import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import BookingsLib "../lib/bookings";
import BookingsTypes "../types/bookings";
import Common "../types/common";

mixin (
  bookings : List.List<BookingsTypes.Booking>,
  nextBookingId : { var value : Nat },
  adminSet : { var admin : ?Principal },
) {
  public shared ({ caller }) func createBooking(input : BookingsTypes.CreateBookingInput) : async BookingsTypes.Booking {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in to create a booking");
    let id = nextBookingId.value;
    nextBookingId.value += 1;
    BookingsLib.createBooking(bookings, id, caller, input);
  };

  public shared ({ caller }) func cancelBooking(id : Common.EntityId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    BookingsLib.cancelBooking(bookings, id, caller);
  };

  public query func getBooking(id : Common.EntityId) : async ?BookingsTypes.Booking {
    BookingsLib.getBooking(bookings, id);
  };

  public shared query ({ caller }) func getUserBookings() : async [BookingsTypes.Booking] {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    BookingsLib.getUserBookings(bookings, caller);
  };

  public shared ({ caller }) func listAllBookings() : async [BookingsTypes.Booking] {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    BookingsLib.listAllBookings(bookings);
  };

  public shared ({ caller }) func confirmBookingPayment(bookingId : Common.EntityId, transactionId : Text, amount : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    BookingsLib.confirmBookingPayment(bookings, bookingId, transactionId, amount);
  };
};
