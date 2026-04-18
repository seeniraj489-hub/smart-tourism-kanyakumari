import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/guides";
import Common "../types/common";

module {
  public func createGuide(
    guides : List.List<Types.Guide>,
    nextId : Nat,
    input : Types.CreateGuideInput,
  ) : Types.Guide {
    let guide : Types.Guide = {
      id = nextId;
      name = input.name;
      specialization = input.specialization;
      bio = input.bio;
      languagesSpoken = input.languagesSpoken;
      phoneNumber = input.phoneNumber;
      ratePerDay = input.ratePerDay;
      experienceYears = input.experienceYears;
      imageUrl = input.imageUrl;
      isAvailable = input.isAvailable;
      createdAt = Time.now();
    };
    guides.add(guide);
    guide;
  };

  public func updateGuide(
    guides : List.List<Types.Guide>,
    input : Types.UpdateGuideInput,
  ) : Bool {
    var found = false;
    guides.mapInPlace(func(g) {
      if (g.id == input.id) {
        found := true;
        {
          g with
          name = input.name;
          specialization = input.specialization;
          bio = input.bio;
          languagesSpoken = input.languagesSpoken;
          phoneNumber = input.phoneNumber;
          ratePerDay = input.ratePerDay;
          experienceYears = input.experienceYears;
          imageUrl = input.imageUrl;
          isAvailable = input.isAvailable;
        };
      } else { g };
    });
    found;
  };

  public func deleteGuide(
    guides : List.List<Types.Guide>,
    id : Common.EntityId,
  ) : Bool {
    let sizeBefore = guides.size();
    let filtered = guides.filter(func(g) { g.id != id });
    guides.clear();
    guides.append(filtered);
    guides.size() < sizeBefore;
  };

  public func getGuide(
    guides : List.List<Types.Guide>,
    id : Common.EntityId,
  ) : ?Types.Guide {
    guides.find(func(g) { g.id == id });
  };

  public func listGuides(guides : List.List<Types.Guide>) : [Types.Guide] {
    guides.toArray();
  };

  public func searchGuides(
    guides : List.List<Types.Guide>,
    term : Text,
    specialization : ?Types.GuideSpecialization,
  ) : [Types.Guide] {
    let lowerTerm = term.toLower();
    guides.filter(func(g) {
      let matchesTerm = term == "" or
        g.name.toLower().contains(#text lowerTerm) or
        g.bio.toLower().contains(#text lowerTerm);
      let matchesSpec = switch (specialization) {
        case null true;
        case (?spec) {
          switch (g.specialization, spec) {
            case (#heritage, #heritage) true;
            case (#nature, #nature) true;
            case (#adventure, #adventure) true;
            case (#general, #general) true;
            case _ false;
          };
        };
      };
      matchesTerm and matchesSpec;
    }).toArray();
  };

  public func seedSampleGuides(
    guides : List.List<Types.Guide>,
    nextIdRef : { var value : Nat },
  ) {
    let samples : [Types.CreateGuideInput] = [
      {
        name = "Murugan Selvam";
        specialization = #heritage;
        bio = "Born and raised in Kanyakumari, Murugan has been guiding tourists for 12 years. He specializes in the rich history of the temples, palaces and monuments of the region.";
        languagesSpoken = ["Tamil", "English", "Malayalam"];
        phoneNumber = "+91 94432 11234";
        ratePerDay = 1500;
        experienceYears = 12;
        imageUrl = "";
        isAvailable = true;
      },
      {
        name = "Lakshmi Devi";
        specialization = #nature;
        bio = "A passionate naturalist and trekking expert who knows every trail and wildlife spot around Kanyakumari. She conducts guided nature walks, bird watching tours, and sunrise viewpoint treks.";
        languagesSpoken = ["Tamil", "English", "Hindi"];
        phoneNumber = "+91 98421 55678";
        ratePerDay = 1200;
        experienceYears = 8;
        imageUrl = "";
        isAvailable = true;
      },
      {
        name = "Arjun Pillai";
        specialization = #adventure;
        bio = "An adrenaline junkie and certified water sports instructor who has explored the coastline of Kanyakumari extensively. Specializes in sea kayaking, snorkeling, and coastal adventure tours.";
        languagesSpoken = ["Tamil", "English", "Malayalam", "Telugu"];
        phoneNumber = "+91 76391 88901";
        ratePerDay = 1800;
        experienceYears = 6;
        imageUrl = "";
        isAvailable = true;
      },
      {
        name = "Valli Kumari";
        specialization = #general;
        bio = "A friendly and knowledgeable local guide with expertise in all aspects of Kanyakumari tourism. From temple visits to shopping for local handicrafts and seafood recommendations, Valli ensures a complete experience.";
        languagesSpoken = ["Tamil", "English", "Hindi", "Malayalam"];
        phoneNumber = "+91 89034 22345";
        ratePerDay = 1000;
        experienceYears = 10;
        imageUrl = "";
        isAvailable = true;
      },
    ];
    for (input in samples.values()) {
      let id = nextIdRef.value;
      nextIdRef.value += 1;
      ignore createGuide(guides, id, input);
    };
  };
};
