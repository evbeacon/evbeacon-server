import mongoose from "mongoose";
import { createReport, getReport, updateReport } from "./Report";
import { SafeUserType } from "../../types/User";
import { getUser, signUp } from "./User";
import { NewReportActionType } from "../../types/Report";
import User from "../models/User";

describe("Report", () => {
  let admin: SafeUserType;
  let mockReport: NewReportActionType;
  beforeAll(async () => {
    const token = await signUp({
      email: "report@hello.com",
      password: "somePass",
      name: "My Name",
    });

    admin = await getUser({ token });

    admin = await User.findByIdAndUpdate(
      admin._id,
      {
        $set: {
          role: "Admin",
        },
      },
      {
        new: true,
      }
    );

    mockReport = {
      type: "User" as const,
      reported: "5f68a882170de39b76935ee5",
      reason: "Some reason",
      explanation: "Some explanation",
    };
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new report", async () => {
    const insertedReport = await createReport(admin, mockReport);

    expect(insertedReport).not.toBeNull();
    expect(insertedReport.reported.toString()).toEqual(mockReport.reported);
    expect(insertedReport.reason).toEqual(mockReport.reason);
  });

  it("should fail createReport on null value", async () => {
    try {
      await createReport(admin, { type: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get report from reportId", async () => {
    const insertedReport = await createReport(admin, mockReport);

    expect(insertedReport).not.toBeNull();
    expect(insertedReport.reported.toString()).toEqual(mockReport.reported);
    expect(insertedReport.reason).toEqual(mockReport.reason);

    const gotReport = await getReport(admin, { _id: insertedReport._id });
    expect(gotReport).toEqual(insertedReport);
  });

  it("should fail getReport on missing reportId", async () => {
    try {
      await getReport(admin, { _id: null });
    } catch (error) {
      expect(error.message).toEqual("ReportID must be provided!");
    }
  });

  it("should fail getReport on missing report", async () => {
    try {
      await getReport(admin, { _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Report does not exist!");
    }
  });

  it("should update report", async () => {
    const insertedReport = await createReport(admin, mockReport);

    expect(insertedReport).not.toBeNull();
    expect(insertedReport.reported.toString()).toEqual(mockReport.reported);
    expect(insertedReport.reason).toEqual(mockReport.reason);

    const updateFields = {
      _id: insertedReport._id,
      ruling: "Some ruling",
    };

    const updatedReport = await updateReport(admin, updateFields);

    expect(updatedReport).not.toBeNull();
    expect(updatedReport.reported.toString()).toEqual(mockReport.reported);
    expect(updatedReport.ruling).toEqual(updateFields.ruling);
  });

  it("should fail updateReport on nonadmin", async () => {
    const insertedReport = await createReport(admin, mockReport);

    expect(insertedReport).not.toBeNull();
    expect(insertedReport.reported.toString()).toEqual(mockReport.reported);
    expect(insertedReport.reason).toEqual(mockReport.reason);

    const updateFields = {
      _id: insertedReport._id,
      ruling: "Some ruling",
    };

    try {
      await updateReport(
        {
          ...admin,
          role: "User",
        },
        updateFields
      );
    } catch (error) {
      expect(error.message).toEqual("Only admins can update reports!");
    }
  });

  it("should fail updateReport on missing reportId", async () => {
    try {
      await updateReport(admin, { _id: null, ruling: "" });
    } catch (error) {
      expect(error.message).toEqual("ReportID must be provided!");
    }
  });

  it("should fail updateReport on missing report", async () => {
    try {
      await updateReport(admin, {
        _id: "5f68a882170de39b76935ee5",
        ruling: "",
      });
    } catch (error) {
      expect(error.message).toEqual("Report does not exist!");
    }
  });
});
