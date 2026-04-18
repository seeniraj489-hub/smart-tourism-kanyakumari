import Common "common";

module {
  public type PlaceCategory = {
    #beach;
    #waterfall;
    #temple;
    #viewpoint;
    #other;
  };

  public type Place = {
    id : Common.EntityId;
    name : Text;
    category : PlaceCategory;
    description : Text;
    address : Text;
    bestTimeToVisit : Text;
    imageUrls : [Text];
    isFeatured : Bool;
    createdAt : Common.Timestamp;
    latitude : ?Float;
    longitude : ?Float;
  };

  public type CreatePlaceInput = {
    name : Text;
    category : PlaceCategory;
    description : Text;
    address : Text;
    bestTimeToVisit : Text;
    imageUrls : [Text];
    isFeatured : Bool;
    latitude : ?Float;
    longitude : ?Float;
  };

  public type UpdatePlaceInput = {
    id : Common.EntityId;
    name : Text;
    category : PlaceCategory;
    description : Text;
    address : Text;
    bestTimeToVisit : Text;
    imageUrls : [Text];
    isFeatured : Bool;
    latitude : ?Float;
    longitude : ?Float;
  };
};
