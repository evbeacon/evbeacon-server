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

export interface NewBeaconActionType {
  vehicle: BeaconType["vehicle"];
  vehicleRange: BeaconType["vehicleRange"];
  location: BeaconType["location"];
}

export interface GetBeaconActionType {
  _id: BeaconType["_id"];
}

export interface UpdateBeaconChargerActionType {
  _id: BeaconType["_id"];
  charger: ChargerType["_id"];
}

export interface CancelBeaconActionType {
  _id: ChargerType["_id"];
}
