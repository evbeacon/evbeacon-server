import type { VehicleType } from "../vehicle";

export type CreateVehicleParams = {
  year: VehicleType["year"];
  make: VehicleType["make"];
  model: VehicleType["model"];
  color: VehicleType["color"];
  plugType: VehicleType["plugType"];
  licensePlate: VehicleType["licensePlate"];
};

export type CreateVehicleResponse = VehicleType;

export type GetVehicleParams = {
  _id?: VehicleType["_id"];
};

export type GetVehicleResponse = VehicleType[];

export type UpdateVehicleParams = {
  _id: VehicleType["_id"];
  year?: VehicleType["year"];
  make?: VehicleType["make"];
  model?: VehicleType["model"];
  color?: VehicleType["color"];
  plugType?: VehicleType["plugType"];
};

export type UpdateVehicleResponse = VehicleType;

export type DeleteVehicleParams = {
  _id: VehicleType["_id"];
};

export type DeleteVehicleResponse = VehicleType;

export type BanVehicleParams = {
  _id: VehicleType["_id"];
  banned?: VehicleType["banned"];
};

export type BanVehicleResponse = void;
