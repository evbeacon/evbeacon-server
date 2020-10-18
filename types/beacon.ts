import type { UserType } from "./user";
import type { VehicleType } from "./vehicle";
import type { ChargerType } from "./charger";
import type { LocationType } from "./location";

export type BeaconType = {
  _id: string;
  owner: UserType["_id"];
  vehicle: VehicleType["_id"];
  vehicleRange: number;
  location: LocationType;
  allowedChargers: ChargerType["_id"][];
  cancelled: boolean;
};
