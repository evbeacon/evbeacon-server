import { MongooseDocument } from "mongoose";
import { UserType } from "./User";
import { LocationType } from "./Location";
import { AddressType } from "./Address";

export interface ChargerType extends MongooseDocument {
  owner: UserType["_id"];
  location: LocationType;
  address: AddressType;
  plugType: string;
  description?: string;
  offHoursStartUTC?: number;
  offHoursEndUTC?: number;
  disabledUntil?: Date;
  banned: boolean;
}

export interface NewChargerType {
  owner: ChargerType["owner"];
  location: ChargerType["location"];
  address: ChargerType["address"];
  plugType: ChargerType["plugType"];
  description?: ChargerType["description"];
  offHoursStartUTC?: ChargerType["offHoursStartUTC"];
  offHoursEndUTC?: ChargerType["offHoursEndUTC"];
  disabledUntil?: ChargerType["disabledUntil"];
}

export interface GetChargerType {
  _id: ChargerType["_id"];
}

export interface UpdateChargerType {
  _id: ChargerType["_id"];
  plugType?: ChargerType["plugType"];
  description?: ChargerType["description"];
  offHoursStartUTC?: ChargerType["offHoursStartUTC"];
  offHoursEndUTC?: ChargerType["offHoursEndUTC"];
  disabledUntil?: ChargerType["disabledUntil"];
}

export interface DeleteChargerType {
  _id: ChargerType["_id"];
}

export interface BanChargerType {
  _id: ChargerType["_id"];
  banned?: ChargerType["banned"];
}