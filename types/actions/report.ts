import type { ReportType } from "../report";

export type CreateReportParams = {
  type: ReportType["type"];
  reported: ReportType["reported"];
  reason: ReportType["reason"];
  explanation: ReportType["explanation"];
};

export type CreateReportResponse = ReportType;

export type GetReportParams = {
  _id: ReportType["_id"];
};

export type GetReportResponse = ReportType;

export type UpdateReportParams = {
  _id: ReportType["_id"];
  ruling: ReportType["ruling"];
};

export type UpdateReportResponse = ReportType;
