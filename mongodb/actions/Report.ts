import { Types } from "mongoose";
import initDB from "../index";
import Report from "../models/Report";
import type { ReportType } from "../../types/report";
import type {
  CreateReportParams,
  CreateReportResponse,
  GetReportParams,
  GetReportResponse,
  UpdateReportParams,
  UpdateReportResponse,
} from "../../types/actions/report";
import type { SafeUserType } from "../../types/user";

export const createReport = async (
  user: SafeUserType,
  report: CreateReportParams
): Promise<CreateReportResponse> => {
  Object.values(report).forEach((value) => {
    if (value == null) {
      throw new Error("All parameters must be provided!");
    }
  });

  await initDB();

  const reportFields = {
    ...report,
    madeBy: user._id,
  };

  const newReport = new Report(reportFields);

  await newReport.validate();
  await newReport.save();

  return newReport.toObject();
};

export const getReport = async (
  user: SafeUserType,
  { _id }: GetReportParams
): Promise<GetReportResponse> => {
  if (_id == null) {
    throw new Error("ReportID must be provided!");
  }

  await initDB();

  const reportQuery = {
    _id: Types.ObjectId(_id),
    ...(user.role === "User" && {
      owner: user._id,
    }),
  };

  const report = (await Report.findOne(reportQuery).lean()) as ReportType;
  if (report == null) {
    throw new Error("Report does not exist!");
  }

  return report;
};

export const updateReport = async (
  user: SafeUserType,
  { _id, ...updateFields }: UpdateReportParams
): Promise<UpdateReportResponse> => {
  if (_id == null) {
    throw new Error("ReportID must be provided!");
  } else if (user.role !== "Admin") {
    throw new Error("Only admins can update reports!");
  }

  await initDB();

  const newReport = (await Report.findByIdAndUpdate(
    _id,
    {
      $set: {
        ...updateFields,
        decided: true,
        decidedBy: user._id,
      },
    },
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
