import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let activeProducts = Set.empty<Nat>();
  let archivedProducts = Set.empty<Nat>();

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;
  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;
  let userProfiles = Map.empty<Principal, UserProfile>();

  type Address = {
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
  };

  type ProductUpdate = {
    name : Text;
    price : Float;
    description : Text;
    image : Text;
  };

  type Product = {
    id : Nat;
    name : Text;
    price : Float;
    description : Text;
    image : Text;
  };

  type Order = {
    id : Nat;
    userId : Nat;
    name : Text;
    profile : UserProfile;
    productIds : [Nat];
    totalAmount : Float;
    orderTime : Time.Time;
    deliveryAddress : Address;
    status : OrderStatus;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Catalog - Public Read Access (including guests)
  public query func getTotalProductCount() : async Nat {
    products.size();
  };

  public query func getActiveProductCount() : async Nat {
    activeProducts.size();
  };

  public query func getProduct(id : Nat) : async ?Product {
    if (not isProductActive(id)) {
      return null;
    };
    products.get(id);
  };

  public query func getActiveProducts() : async [Product] {
    let iter = products.filter(func(k, _) { isProductActive(k) }).values();
    iter.toArray();
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all products");
    };
    products.values().toArray();
  };

  // Order Placement - User Only
  public shared ({ caller }) func placeOrder(profile : UserProfile, productIds : [Nat], deliveryAddress : Address, totalAmount : Float) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    for (productId in productIds.values()) {
      if (not isProductActive(productId)) {
        Runtime.trap("One or more products are unavailable.");
      };
    };

    // Validate order total
    let productPrices = productIds.map(func(id) { getProductPrice(id) });
    let sum = productPrices.foldLeft(0.0, func(acc, price) { acc + price });

    if (sum != totalAmount) {
      Runtime.trap("Invalid order sum");
    };

    let newOrder : Order = {
      id = nextOrderId;
      userId = 0;
      name = "";
      profile;
      productIds;
      totalAmount;
      orderTime = Time.now();
      deliveryAddress;
      status = #pending;
    } : Order;

    orders.add(nextOrderId, newOrder);
    nextOrderId += 1;

    newOrder;
  };

  func isProductActive(id : Nat) : Bool {
    activeProducts.contains(id);
  };

  func isProductArchived(id : Nat) : Bool {
    archivedProducts.contains(id);
  };

  func getProductPrice(id : Nat) : Float {
    switch (products.get(id)) {
      case (?product) { product.price };
      case (null) { 0.0 };
    };
  };

  // Product Management - Admin Only
  public shared ({ caller }) func createProduct(product : Product) : async () {
    onlyAdmin(caller);
    let productWithId = {
      product with
      id = nextProductId;
    };
    products.add(nextProductId, productWithId);
    activeProducts.add(nextProductId);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : ProductUpdate) : async () {
    onlyAdmin(caller);
    switch (products.get(id)) {
      case (?existing) {
        let newProduct : Product = {
          id;
          name = updatedProduct.name;
          price = updatedProduct.price;
          description = updatedProduct.description;
          image = updatedProduct.image;
        };
        products.add(id, newProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func archiveProduct(id : Nat) : async () {
    onlyAdmin(caller);
    if (isProductActive(id)) {
      activeProducts.remove(id);
      archivedProducts.add(id);
    };
  };

  public shared ({ caller }) func restoreProduct(id : Nat) : async () {
    onlyAdmin(caller);
    if (isProductArchived(id)) {
      archivedProducts.remove(id);
      activeProducts.add(id);
    };
  };

  // Order Management - Admin Only
  public query ({ caller }) func getOrder(id : Nat) : async Order {
    onlyAdmin(caller);
    switch (orders.get(id)) {
      case (?order) { order };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    onlyAdmin(caller);
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    onlyAdmin(caller);
    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder : Order = {
          order with
          status
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func isAdmin(caller : Principal) : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  func onlyAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
