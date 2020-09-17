import { MongooseDocument } from "mongoose";
import { UserType } from "./User";

export interface ReportType extends MongooseDocument {
  type: "User" | "Charger" | "Vehicle";
  reported: MongooseDocument["_id"];
  madeBy: UserType["_id"];
  reason: string;
  explanation: string;
  decided: boolean;
  decidedBy?: UserType["_id"];
  ruling?: string;
}

export interface NewReportType {
  type: ReportType["type"];
  reported: ReportType["reported"];
  madeBy: ReportType["madeBy"];
  reason: ReportType["reason"];
  explanation: ReportType["explanation"];
}

export interface UpdateReportType {
  _id: ReportType["_id"];
  decided: ReportType["decided"];
  decidedBy: ReportType["decidedBy"];
  ruling: ReportType["ruling"];
}
