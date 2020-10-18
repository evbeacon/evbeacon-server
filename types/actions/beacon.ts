import type { BeaconType } from "../beacon";

export type CreateBeaconParams = {
  vehicle: BeaconType["vehicle"];
  vehicleRange: BeaconType["vehicleRange"];
  location: BeaconType["location"];
};

export type CreateBeaconResponse = BeaconType;

export type GetBeaconParams = {
  _id: BeaconType["_id"];
};

export type GetBeaconResponse = BeaconType;

export type UpdateBeaconParams = {
  _id: BeaconType["_id"];
  charger: BeaconType["allowedChargers"][0];
};

export type UpdateBeaconResponse = BeaconType;

export type CancelBeaconParams = {
  _id: BeaconType["_id"];
};

export type CancelBeaconResponse = void;
