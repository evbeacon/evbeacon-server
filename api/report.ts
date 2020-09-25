import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getReport from "../apiHandlers/Report/getReport";
import createReport from "../apiHandlers/Report/createReport";
import updateReport from "../apiHandlers/Report/updateReport";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "GET") {
    return getReport(req, res);
  } else if (req.method === "POST") {
    return createReport(req, res);
  } else if (req.method === "PATCH") {
    return updateReport(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
