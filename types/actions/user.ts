import type { UserType, SafeUserType } from "../user";

export type GetUserParams = {
  _id?: UserType["_id"];
};

export type GetUserResponse = SafeUserType;

export type UpdateUserParams = {
  _id: UserType["_id"];
  name?: UserType["name"];
  bio?: UserType["bio"];
  finishedCharger?: UserType["finishedCharger"];
  finishedVehicle?: UserType["finishedVehicle"];
};

export type UpdateUserResponse = SafeUserType;

export type BanUserParams = {
  _id: UserType["_id"];
  banned?: UserType["banned"];
};

export type BanUserResponse = void;
