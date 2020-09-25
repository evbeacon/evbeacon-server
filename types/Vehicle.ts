import { MongooseDocument } from "mongoose";
import { UserType } from "./User";

export interface VehicleType extends MongooseDocument {
  owner: UserType["_id"];
  year: number;
  make: string;
  model: string;
  color: string;
  plugType: string;
  licensePlate: string;
  banned: boolean;
}

export interface NewVehicleActionType {
  year: VehicleType["year"];
  make: VehicleType["make"];
  model: VehicleType["model"];
  color: VehicleType["color"];
  plugType: VehicleType["plugType"];
  licensePlate: VehicleType["licensePlate"];
}

export interface GetVehicleActionType {
  _id: VehicleType["_id"];
}

export interface UpdateVehicleActionType {
  _id: VehicleType["_id"];
  year?: VehicleType["year"];
  make?: VehicleType["make"];
  model?: VehicleType["model"];
  color?: VehicleType["color"];
  plugType?: VehicleType["plugType"];
}

export interface DeleteVehicleActionType {
  _id: VehicleType["_id"];
}

export interface BanVehicleActionType {
  _id: VehicleType["_id"];
  banned?: VehicleType["banned"];
}
