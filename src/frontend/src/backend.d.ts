import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Address {
    zip: string;
    street: string;
    country: string;
    city: string;
    state: string;
}
export type Time = bigint;
export interface ProductUpdate {
    name: string;
    description: string;
    image: string;
    price: number;
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
export interface Product {
    id: bigint;
    name: string;
    description: string;
    image: string;
    price: number;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
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
    getTotalProductCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(caller: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(profile: UserProfile, productIds: Array<bigint>, deliveryAddress: Address, totalAmount: number): Promise<Order>;
    restoreProduct(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(id: bigint, updatedProduct: ProductUpdate): Promise<void>;
}
