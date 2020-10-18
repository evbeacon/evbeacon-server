import type { UserType } from "./user";

export interface VehicleType {
  _id: string;
  owner: UserType["_id"];
  year: number;
  make: string;
  model: string;
  color: string;
  plugType: string;
  licensePlate: string;
  banned: boolean;
}
