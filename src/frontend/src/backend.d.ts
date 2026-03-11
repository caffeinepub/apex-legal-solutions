import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ConsultationRequest {
    id: string;
    status: ConsultationStatus;
    caseType: CaseType;
    name: string;
    submittedAt: Time;
    submittedBy: Principal;
    description: string;
    email: string;
    phone: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export enum CaseType {
    realEstate = "realEstate",
    willsAndEstates = "willsAndEstates",
    contracts = "contracts",
    employment = "employment",
    criminal = "criminal",
    civilLitigation = "civilLitigation",
    corporate = "corporate",
    family = "family"
}
export enum ConsultationStatus {
    responded = "responded",
    pending = "pending",
    reviewed = "reviewed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkRequestStatus(id: string): Promise<ConsultationStatus>;
    getAllRequests(): Promise<Array<ConsultationRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitConsultationRequest(name: string, email: string, phone: string, caseType: CaseType, description: string): Promise<string>;
    updateRequestStatus(id: string, status: ConsultationStatus): Promise<void>;
}
