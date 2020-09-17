import { MongooseDocument } from "mongoose";

export interface UserType extends MongooseDocument {
  email: string;
  password: string;
  role: "Admin" | "User";
  name: string;
  bio?: string;
  banned: boolean;
}

export interface SafeUserType {
  email: UserType["email"];
  role: UserType["role"];
  name: UserType["name"];
  bio?: UserType["bio"];
  banned: UserType["banned"];
}

export interface UserJWTType {
  _id: UserType["_id"];
  email: UserType["email"];
  role: UserType["role"];
}

export interface NewUserType {
  email: UserType["email"];
  password: UserType["password"];
  name: UserType["name"];
  bio?: UserType["bio"];
}

export interface LoginUserType {
  email: UserType["email"];
  password: UserType["password"];
}

export interface UpdateUserType {
  _id: UserType["_id"];
  name?: UserType["name"];
  bio?: UserType["bio"];
}

export interface BanUserType {
  _id: UserType["_id"];
  banned: UserType["banned"];
}
