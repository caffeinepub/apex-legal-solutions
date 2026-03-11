import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Auth "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization
  let accessControlState = Auth.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type CaseType = {
    #civilLitigation;
    #criminal;
    #family;
    #employment;
    #contracts;
    #corporate;
    #realEstate;
    #willsAndEstates;
  };

  public type ConsultationStatus = {
    #pending;
    #reviewed;
    #responded;
  };

  public type ConsultationRequest = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    caseType : CaseType;
    description : Text;
    status : ConsultationStatus;
    submittedAt : Time.Time;
    submittedBy : Principal;
  };

  module ConsultationRequest {
    public func compare(a : ConsultationRequest, b : ConsultationRequest) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  // Storage
  let requests = Map.empty<Text, ConsultationRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextRequestId : Nat = 0;

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (Auth.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Auth.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (Auth.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public User Functions
  public shared ({ caller }) func submitConsultationRequest(
    name : Text,
    email : Text,
    phone : Text,
    caseType : CaseType,
    description : Text,
  ) : async Text {
    // No authorization check - public users (including guests) can submit
    let id = nextRequestId.toText();
    nextRequestId += 1;

    let request : ConsultationRequest = {
      id;
      name;
      email;
      phone;
      caseType;
      description;
      status = #pending;
      submittedAt = Time.now();
      submittedBy = caller;
    };

    requests.add(id, request);
    id;
  };

  public query ({ caller }) func checkRequestStatus(id : Text) : async ConsultationStatus {
    // Public users can check status of their own request
    // Admins can check any request
    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        // Verify ownership: caller must be the submitter OR an admin
        if (caller != request.submittedBy and not Auth.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only check status of your own request");
        };
        request.status;
      };
    };
  };

  // Admin Functions
  public shared ({ caller }) func updateRequestStatus(id : Text, status : ConsultationStatus) : async () {
    if (not Auth.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (requests.get(id)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let updatedRequest = { request with status };
        requests.add(id, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getAllRequests() : async [ConsultationRequest] {
    if (not Auth.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    requests.values().toArray().sort();
  };
};
