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

export interface NewReportActionType {
  type: ReportType["type"];
  reported: ReportType["reported"];
  reason: ReportType["reason"];
  explanation: ReportType["explanation"];
}

export interface GetReportActionType {
  _id: ReportType["_id"];
}

export interface UpdateReportActionType {
  _id: ReportType["_id"];
  ruling: ReportType["ruling"];
}
