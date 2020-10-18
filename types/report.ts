import type { UserType } from "./user";
import type { ChargerType } from "./charger";
import type { VehicleType } from "./vehicle";

export type ReportType = {
  _id: string;
  type: "User" | "Charger" | "Vehicle";
  reported: UserType["_id"] | ChargerType["_id"] | VehicleType["_id"];
  madeBy: UserType["_id"];
  reason: string;
  explanation: string;
  decided: boolean;
  decidedBy?: UserType["_id"];
  ruling?: string;
};
