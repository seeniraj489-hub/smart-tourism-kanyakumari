import Common "common";
import AuthPayment "auth-payment";

module {
  public type BookingType = {
    #hotel;
    #guide;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type Booking = {
    id : Common.EntityId;
    userId : Common.UserId;
    bookingType : BookingType;
    referenceId : Common.EntityId;
    checkIn : Text;
    checkOut : Text;
    guestCount : Nat;
    status : BookingStatus;
    referenceNumber : Text;
    createdAt : Common.Timestamp;
    // Payment fields (optional for backward compat)
    paymentStatus : AuthPayment.PaymentStatus;
    paymentAmount : Nat;
    paymentTransactionId : ?Text;
  };

  public type CreateBookingInput = {
    bookingType : BookingType;
    referenceId : Common.EntityId;
    checkIn : Text;
    checkOut : Text;
    guestCount : Nat;
    paymentAmount : Nat;
    paymentTransactionId : ?Text;
  };
};
