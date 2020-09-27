import { NowRequest, NowResponse, NowApiHandler } from "@vercel/node";
import signUp from "../apiHandlers/User/signUp";

const handler: NowApiHandler = (req: NowRequest, res: NowResponse) => {
  if (req.method === "POST") {
    return signUp(req, res);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid http request!",
    });
  }
};

export default handler;
