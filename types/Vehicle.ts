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

export interface NewVehicleType {
  owner: VehicleType["owner"];
  year: VehicleType["year"];
  make: VehicleType["make"];
  model: VehicleType["model"];
  color: VehicleType["color"];
  plugType: VehicleType["plugType"];
  licensePlate: VehicleType["licensePlate"];
}

export interface GetVehicleType {
  _id: VehicleType["_id"];
}

export interface UpdateVehicleType {
  _id: VehicleType["_id"];
  year?: VehicleType["year"];
  make?: VehicleType["make"];
  model?: VehicleType["model"];
  color?: VehicleType["color"];
  plugType?: VehicleType["plugType"];
}

export interface DeleteVehicleType {
  _id: VehicleType["_id"];
}

export interface BanVehicleType {
  _id: VehicleType["_id"];
  banned?: VehicleType["banned"];
}
