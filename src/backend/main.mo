import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
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

  // New quotes map for storing quote requests/lead data
  let quotes = Map.empty<Nat, ServiceQuote>();
  var nextQuoteId = 1;

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

  // New quote request/service lead types
  public type ServiceQuote = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    message : Text;
    serviceType : Text;
    status : QuoteStatus;
    createdTime : Time.Time;
    adminNotes : Text;
  };

  public type QuoteStatus = {
    #received;
    #in_progress;
    #completed;
    #rejected;
  };

  public type ServiceQuoteCreate = {
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    message : Text;
    serviceType : Text;
  };

  public type ServiceQuoteUpdate = {
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    message : Text;
    serviceType : Text;
    adminNotes : Text;
    status : QuoteStatus;
  };

  // Quote/Lead Management Functions
  // Public access - anyone including guests can submit a quote request (lead capture)
  public shared func requestServiceQuote(quoteInput : ServiceQuoteCreate) : async Nat {
    let newQuote : ServiceQuote = {
      id = nextQuoteId;
      name = quoteInput.name;
      email = quoteInput.email;
      phone = quoteInput.phone;
      address = quoteInput.address;
      message = quoteInput.message;
      serviceType = quoteInput.serviceType;
      status = #received;
      createdTime = Time.now();
      adminNotes = "";
    };

    quotes.add(nextQuoteId, newQuote);
    let createdId = nextQuoteId;
    nextQuoteId += 1;
    createdId;
  };

  // Admin-only: View individual quote
  public query ({ caller }) func getQuote(quoteId : Nat) : async ServiceQuote {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view quotes");
    };
    switch (quotes.get(quoteId)) {
      case (?quote) { quote };
      case (null) {
        Runtime.trap("Invalid quoteId");
      };
    };
  };

  // Admin-only: View all quotes
  public query ({ caller }) func getQuotes() : async [ServiceQuote] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view quotes");
    };
    quotes.values().toArray();
  };

  // Admin-only: Update quote
  public shared ({ caller }) func updateQuote(id : Nat, update : ServiceQuoteUpdate) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update quotes");
    };
    let serviceQuote = switch (quotes.get(id)) {
      case (?quote) { quote };
      case (null) {
        Runtime.trap("Invalid quoteId");
      };
    };

    let updatedQuote : ServiceQuote = {
      serviceQuote with
      name = update.name;
      email = update.email;
      phone = update.phone;
      address = update.address;
      message = update.message;
      serviceType = update.serviceType;
      adminNotes = update.adminNotes;
      status = update.status;
    };

    quotes.add(id, updatedQuote);
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

  // NEW: Add admin role based on email address
  public shared ({ caller }) func addAdminByEmail(email : Text) : async () {
    // Only current admins can use this method
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add new admins");
    };

    // Find principal matching the given email
    if (email.size() == 0) {
      Runtime.trap("Email cannot be empty");
    };

    // Iterate through the entries of the userProfiles map
    let userProfilesIter = userProfiles.entries();

    // Find the first matching entry
    var matchingEntry : ?(Principal, UserProfile) = null;
    for (entry in userProfilesIter) {
      if (entry.1.email == email) {
        matchingEntry := ?entry;
      };
    };

    // If email found, assign admin role to principal
    switch (matchingEntry) {
      case (?(principal, _profile)) {
        AccessControl.assignRole(accessControlState, caller, principal, #admin);
      };
      case (null) {
        Runtime.trap("No user found with this email.");
      };
    };
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
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let productWithId = {
      product with
      id = nextProductId;
    };
    products.add(nextProductId, productWithId);
    activeProducts.add(nextProductId);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : ProductUpdate) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
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
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can archive products");
    };
    if (isProductActive(id)) {
      activeProducts.remove(id);
      archivedProducts.add(id);
    };
  };

  public shared ({ caller }) func restoreProduct(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can restore products");
    };
    if (isProductArchived(id)) {
      archivedProducts.remove(id);
      activeProducts.add(id);
    };
  };

  // Order Management - Admin Only
  public query ({ caller }) func getOrder(id : Nat) : async Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    switch (orders.get(id)) {
      case (?order) { order };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
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

  func onlyAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
