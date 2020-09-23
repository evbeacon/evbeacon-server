import mongoose from "mongoose";
import { createReport, getReport, updateReport } from "./Report";

const mockReport = {
  type: "User" as const,
  reported: "5f68a882170de39b76935ee5",
  madeBy: "5f68a882170de39b76935ee5",
  reason: "Some reason",
  explanation: "Some explanation",
};

describe("Report", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new report", async () => {
    const insertedReport = await createReport(mockReport);

    expect(insertedReport).not.toBeNull();
    expect(insertedReport.reported.toString()).toEqual(mockReport.reported);
    expect(insertedReport.reason).toEqual(mockReport.reason);
  });

  it("should fail createReport on null value", async () => {
    try {
      await createReport({ owner: null } as any);
    } catch (error) {
      expect(error.message).toEqual("All parameters must be provided!");
    }
  });

  it("should get report from reportId", async () => {
    const insertedReport = await createReport(mockReport);

    expect(insertedReport).not.toBeNull();
    expect(insertedReport.reported.toString()).toEqual(mockReport.reported);
    expect(insertedReport.reason).toEqual(mockReport.reason);

    const gotReport = await getReport({ _id: insertedReport._id });
    expect(gotReport).toEqual(insertedReport);
  });

  it("should fail getReport on missing reportId", async () => {
    try {
      await getReport({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("ReportID must be provided!");
    }
  });

  it("should fail getReport on missing report", async () => {
    try {
      await getReport({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Report does not exist!");
    }
  });

  it("should update report", async () => {
    const insertedReport = await createReport(mockReport);

    expect(insertedReport).not.toBeNull();
    expect(insertedReport.reported.toString()).toEqual(mockReport.reported);
    expect(insertedReport.reason).toEqual(mockReport.reason);

    const updateFields = {
      _id: insertedReport._id,
      ruling: "Some ruling",
    };

    const updatedReport = await updateReport(updateFields);

    expect(updatedReport).not.toBeNull();
    expect(updatedReport.reported.toString()).toEqual(mockReport.reported);
    expect(updatedReport.ruling).toEqual(updateFields.ruling);
  });

  it("should fail updateReport on missing reportId", async () => {
    try {
      await updateReport({ _id: null });
    } catch (error) {
      expect(error.message).toEqual("ReportID must be provided!");
    }
  });

  it("should fail updateReport on missing report", async () => {
    try {
      await updateReport({ _id: "5f68a882170de39b76935ee5" });
    } catch (error) {
      expect(error.message).toEqual("Report does not exist!");
    }
  });
});
