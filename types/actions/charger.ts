import type { ChargerType } from "../charger";

export type CreateChargerParams = {
  location: ChargerType["location"];
  address: ChargerType["address"];
  plugType: ChargerType["plugType"];
  description?: ChargerType["description"];
  offHoursStartUTC?: ChargerType["offHoursStartUTC"];
  offHoursEndUTC?: ChargerType["offHoursEndUTC"];
  disabledUntil?: ChargerType["disabledUntil"];
};

export type CreateChargerResponse = ChargerType;

export type GetChargerParams = {
  _id?: ChargerType["_id"];
};

export type GetChargerResponse = ChargerType[];

export type UpdateChargerParams = {
  _id: ChargerType["_id"];
  plugType?: ChargerType["plugType"];
  description?: ChargerType["description"];
  offHoursStartUTC?: ChargerType["offHoursStartUTC"];
  offHoursEndUTC?: ChargerType["offHoursEndUTC"];
  disabledUntil?: ChargerType["disabledUntil"];
};

export type UpdateChargerResponse = ChargerType;

export type DeleteChargerParams = {
  _id: ChargerType["_id"];
};

export type DeleteChargerResponse = ChargerType;

export type BanChargerParams = {
  _id: ChargerType["_id"];
  banned?: ChargerType["banned"];
};

export type BanChargerResponse = void;
