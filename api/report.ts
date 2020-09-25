import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import getReport from "../apiHandlers/Report/getReport";
import createReport from "../apiHandlers/Report/createReport";
import updateReport from "../apiHandlers/Report/updateReport";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "get") {
    return getReport(req, res);
  } else if (req.method === "post") {
    return createReport(req, res);
  } else if (req.method === "patch") {
    return updateReport(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
