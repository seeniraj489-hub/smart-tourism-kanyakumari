import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import GuidesLib "../lib/guides";
import GuidesTypes "../types/guides";
import Common "../types/common";

mixin (
  guides : List.List<GuidesTypes.Guide>,
  nextGuideId : { var value : Nat },
  adminSet : { var admin : ?Principal },
) {
  public shared ({ caller }) func createGuide(input : GuidesTypes.CreateGuideInput) : async GuidesTypes.Guide {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    let id = nextGuideId.value;
    nextGuideId.value += 1;
    GuidesLib.createGuide(guides, id, input);
  };

  public shared ({ caller }) func updateGuide(input : GuidesTypes.UpdateGuideInput) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    GuidesLib.updateGuide(guides, input);
  };

  public shared ({ caller }) func deleteGuide(id : Common.EntityId) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    GuidesLib.deleteGuide(guides, id);
  };

  public query func getGuide(id : Common.EntityId) : async ?GuidesTypes.Guide {
    GuidesLib.getGuide(guides, id);
  };

  public query func listGuides() : async [GuidesTypes.Guide] {
    GuidesLib.listGuides(guides);
  };

  public query func searchGuides(term : Text, specialization : ?GuidesTypes.GuideSpecialization) : async [GuidesTypes.Guide] {
    GuidesLib.searchGuides(guides, term, specialization);
  };
};
