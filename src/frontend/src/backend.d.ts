import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceQuote {
    id: bigint;
    status: QuoteStatus;
    serviceType: string;
    name: string;
    createdTime: Time;
    email: string;
    message: string;
    address: Address;
    phone: string;
    adminNotes: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    image: string;
    price: number;
}
export type Time = bigint;
export interface ServiceQuoteCreate {
    serviceType: string;
    name: string;
    email: string;
    message: string;
    address: Address;
    phone: string;
}
export interface ProductUpdate {
    name: string;
    description: string;
    image: string;
    price: number;
}
export interface Address {
    zip: string;
    street: string;
    country: string;
    city: string;
    state: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    deliveryAddress: Address;
    productIds: Array<bigint>;
    userId: bigint;
    name: string;
    orderTime: Time;
    totalAmount: number;
    profile: UserProfile;
}
export interface UserProfile {
    name: string;
    email: string;
    address: Address;
    phone: string;
}
export interface ServiceQuoteUpdate {
    status: QuoteStatus;
    serviceType: string;
    name: string;
    email: string;
    message: string;
    address: Address;
    phone: string;
    adminNotes: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum QuoteStatus {
    in_progress = "in_progress",
    completed = "completed",
    rejected = "rejected",
    received = "received"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    archiveProduct(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<void>;
    getActiveProductCount(): Promise<bigint>;
    getActiveProducts(): Promise<Array<Product>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(id: bigint): Promise<Order>;
    getProduct(id: bigint): Promise<Product | null>;
    getQuote(quoteId: bigint): Promise<ServiceQuote>;
    getQuotes(): Promise<Array<ServiceQuote>>;
    getTotalProductCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(caller: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(profile: UserProfile, productIds: Array<bigint>, deliveryAddress: Address, totalAmount: number): Promise<Order>;
    requestServiceQuote(quoteInput: ServiceQuoteCreate): Promise<bigint>;
    restoreProduct(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(id: bigint, updatedProduct: ProductUpdate): Promise<void>;
    updateQuote(id: bigint, update: ServiceQuoteUpdate): Promise<void>;
}
