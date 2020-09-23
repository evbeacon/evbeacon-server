import { MongooseDocument } from "mongoose";
import { UserType } from "./User";
import { VehicleType } from "./Vehicle";
import { ChargerType } from "./Charger";
import { LocationType } from "./Location";

export interface BeaconType extends MongooseDocument {
  owner: UserType["_id"];
  vehicle: VehicleType["_id"];
  vehicleRange: number;
  location: LocationType;
  allowedChargers: ChargerType["_id"][];
  cancelled: boolean;
}

export interface NewBeaconType {
  owner: BeaconType["owner"];
  vehicle: BeaconType["vehicle"];
  vehicleRange: BeaconType["vehicleRange"];
  location: BeaconType["location"];
}

export interface GetBeaconType {
  _id: ChargerType["_id"];
}

export interface UpdateBeaconType {
  allowedChargers: BeaconType["allowedChargers"];
}

export interface CancelBeaconType {
  _id: ChargerType["_id"];
}
