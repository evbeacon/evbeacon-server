import initDB from "../index";
import Report from "../models/Report";
import {
  ReportType,
  NewReportType,
  GetReportType,
  UpdateReportType,
} from "../../types/Report";

export const createReport = async (
  report: NewReportType
): Promise<ReportType> => {
  Object.values(report).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const newReport = new Report(report);

  await newReport.validate();
  await newReport.save();

  return newReport.toObject();
};

export const getReport = async ({
  _id,
}: GetReportType): Promise<ReportType> => {
  if (_id == null) {
    throw new Error("ReportID must be provided!");
  }

  await initDB();

  const report = (await Report.findById(_id).lean()) as ReportType;
  if (report == null) {
    throw new Error("Report does not exist!");
  }

  return report;
};

export const updateReport = async ({
  _id,
  ...updateFields
}: UpdateReportType): Promise<ReportType> => {
  if (_id == null) {
    throw new Error("ReportID must be provided!");
  }

  await initDB();

  const newReport = (await Report.findByIdAndUpdate(
    _id,
    { $set: updateFields },
    {
      new: true,
      lean: true,
    }
  )) as ReportType;

  if (newReport == null) {
    throw new Error("Report does not exist!");
  }

  return newReport;
};
