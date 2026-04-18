import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Types "../types/bookings";
import Common "../types/common";

module {
  public func generateReferenceNumber(id : Nat, timestamp : Common.Timestamp) : Text {
    // Format: KK-YEAR-PADDED_ID  e.g. KK-2024-001
    // 1 year ≈ 31_536_000_000_000_000 nanoseconds
    let yearsSinceEpoch = Int.abs(timestamp) / 31_536_000_000_000_000;
    let year = 1970 + yearsSinceEpoch;
    let yearText = year.toText();
    let idText = id.toText();
    let padded = if (id < 10) { "00" # idText }
      else if (id < 100) { "0" # idText }
      else { idText };
    "KK-" # yearText # "-" # padded;
  };

  public func createBooking(
    bookings : List.List<Types.Booking>,
    nextId : Nat,
    userId : Common.UserId,
    input : Types.CreateBookingInput,
  ) : Types.Booking {
    let now = Time.now();
    let refNum = generateReferenceNumber(nextId, now);
    let booking : Types.Booking = {
      id = nextId;
      userId;
      bookingType = input.bookingType;
      referenceId = input.referenceId;
      checkIn = input.checkIn;
      checkOut = input.checkOut;
      guestCount = input.guestCount;
      status = #confirmed;
      referenceNumber = refNum;
      createdAt = now;
      paymentStatus = #pending;
      paymentAmount = input.paymentAmount;
      paymentTransactionId = input.paymentTransactionId;
    };
    bookings.add(booking);
    booking;
  };

  public func cancelBooking(
    bookings : List.List<Types.Booking>,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : Bool {
    var found = false;
    bookings.mapInPlace(func(b) {
      if (b.id == id and Principal.equal(b.userId, caller)) {
        found := true;
        { b with status = #cancelled };
      } else { b };
    });
    found;
  };

  public func confirmBookingPayment(
    bookings : List.List<Types.Booking>,
    id : Common.EntityId,
    transactionId : Text,
    amount : Nat,
  ) : Bool {
    var found = false;
    bookings.mapInPlace(func(b) {
      if (b.id == id) {
        found := true;
        { b with
          paymentStatus = #completed;
          paymentTransactionId = ?transactionId;
          paymentAmount = amount;
          status = #confirmed;
        };
      } else { b };
    });
    found;
  };

  public func getBooking(
    bookings : List.List<Types.Booking>,
    id : Common.EntityId,
  ) : ?Types.Booking {
    bookings.find(func(b) { b.id == id });
  };

  public func getUserBookings(
    bookings : List.List<Types.Booking>,
    userId : Common.UserId,
  ) : [Types.Booking] {
    bookings.filter(func(b) { Principal.equal(b.userId, userId) }).toArray();
  };

  public func listAllBookings(bookings : List.List<Types.Booking>) : [Types.Booking] {
    bookings.toArray();
  };
};
