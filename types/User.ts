import { MongooseDocument } from "mongoose";

export interface UserType extends MongooseDocument {
  email: string;
  password: string;
  role: "Admin" | "User";
  name: string;
  bio?: string;
  finishedCharger: boolean;
  finishedVehicle: boolean;
  banned: boolean;
}

export interface SafeUserType {
  _id: UserType["_id"];
  email: UserType["email"];
  role: UserType["role"];
  name: UserType["name"];
  bio?: UserType["bio"];
  finishedCharger: UserType["finishedCharger"];
  finishedVehicle: UserType["finishedVehicle"];
  banned: UserType["banned"];
}

export interface UserJWTType {
  _id: UserType["_id"];
  email: UserType["email"];
  role: UserType["role"];
}

export interface NewUserActionType {
  email: UserType["email"];
  password: UserType["password"];
  name: UserType["name"];
  bio?: UserType["bio"];
}

export interface LoginUserActionType {
  email: UserType["email"];
  password: UserType["password"];
}

export interface GetUserActionType {
  _id?: UserType["_id"];
  token?: string;
  withChargers?: boolean;
  withVehicles?: boolean;
}

export interface UpdateUserActionType {
  _id: UserType["_id"];
  name?: UserType["name"];
  bio?: UserType["bio"];
  finishedCharger?: UserType["finishedCharger"];
  finishedVehicle?: UserType["finishedVehicle"];
}

export interface BanUserActionType {
  _id: UserType["_id"];
  banned?: UserType["banned"];
}
