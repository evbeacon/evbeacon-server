import { Schema } from "mongoose";

export interface LocationType extends Schema {
  type: "Point";
  coordinates: number[];
}
