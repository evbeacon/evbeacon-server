import type { UserType } from "./user";
import type { LocationType } from "./location";
import type { AddressType } from "./address";

export type ChargerType = {
  _id: string;
  owner: UserType["_id"];
  location: LocationType;
  address: AddressType;
  plugType: string;
  description?: string;
  offHoursStartUTC?: number;
  offHoursEndUTC?: number;
  disabledUntil?: Date;
  banned: boolean;
};
